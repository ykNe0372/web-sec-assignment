import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, token } = await req.json();

  // ユーザー取得
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.totpSecret) {
    return NextResponse.json({ success: false, message: "2FA未設定またはユーザーが存在しません" }, { status: 400 });
  }

  // TOTP検証
  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: "base32",
    token, // 入力された6桁コード
    window: 1, // 時間のズレ許容（必要に応じて調整）
  });

  if (verified) {
    // 必要なら2FA有効フラグを保存
    // await prisma.user.update({ where: { id: userId }, data: { ... } });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, message: "コードが正しくありません" }, { status: 401 });
  }
}