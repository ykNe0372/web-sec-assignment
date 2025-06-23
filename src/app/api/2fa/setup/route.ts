import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, userEmail } = await req.json();

  // 既存のTOTPシークレットがなければ生成
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let secret = user.totpSecret;
  if (!secret) {
    const generated = speakeasy.generateSecret({ length: 32 });
    secret = generated.base32;
    await prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret },
    });
  }

  // otpauth URLを生成
  const otpauthUrl = speakeasy.otpauthURL({
    secret,
    label: encodeURIComponent(userEmail),
    issuer: "SecureSystem",
    encoding: "base32",
  });

  // QRコード画像をbase64で生成
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({
    qrCodeDataUrl,
    otpauthUrl,
  });
}