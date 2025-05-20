import { prisma } from "@/libs/prisma";
import { cookies } from "next/headers";
import { loginRequestSchema } from "@/app/_types/Login";
import type { UserProfile } from "@/app/_types/UserProfile";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import { NextResponse, NextRequest } from "next/server";

// キャッシュを無効化して毎回最新情報を取得
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const POST = async (req: NextRequest) => {
  try {
    const result = loginRequestSchema.safeParse(await req.json());
    if (!result.success) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "リクエストボディの形式が不正です。",
      };
      return NextResponse.json(res);
    }
    const loginRequest = result.data;

    const user = await prisma.user.findUnique({
      where: { email: loginRequest.email },
    });
    if (!user) {
      // 💀 このアカウント（メールアドレス）の有効無効が分かってしまう。
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "このメールアドレスは登録されていません。",
        // message: "メールアドレスまたはパスワードの組み合わせが正しくありません。",
      };
      return NextResponse.json(res);
    }

    // パスワードの検証
    // ✍ bcrypt でハッシュ化したパスワードを検証ように書き換えよ。
    const isValidPassword = user.password === loginRequest.password;
    if (!isValidPassword) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message:
          "メールアドレスまたはパスワードの組み合わせが正しくありません。",
      };
      return NextResponse.json(res);
    }

    // セッションIDの作成
    const sessionTokenMaxAge = 60 * 60 * 3; // 3H
    // const sessionTokenMaxAge = 60; // 1分

    // 💀 当該ユーザのセッションが既にDBに存在するなら消す処理を入れるべき
    // await prisma.session.deleteMany({ where: { userId: user.id } });
    // 👆 ただし、これだと全ての端末のセッションが無効になる ✍ どうすればよい？
    const session = await prisma.session.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        expiresAt: new Date(Date.now() + sessionTokenMaxAge * 1000),
      },
    });

    // クッキーを設定
    const cookieStore = await cookies();
    // 💀 session_id というクッキー名が典型的すぎて狙われやすい（XSSでの標的）
    cookieStore.set("session_id", session.id, {
      path: "/", // ルートパス以下で有効
      httpOnly: true,
      sameSite: "strict",
      maxAge: sessionTokenMaxAge,
      secure: false, // 💀 secure: false は開発用。deploy 時は要切替！
    });

    const res: ApiResponse<UserProfile> = {
      success: true,
      payload: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "",
    };
    return NextResponse.json(res);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    console.error(errorMsg);
    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "ログインのサーバサイドの処理に失敗しました。",
    };
    return NextResponse.json(res);
  }
};
