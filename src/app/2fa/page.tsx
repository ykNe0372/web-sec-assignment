"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const Page: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const userEmail = searchParams.get("userEmail");
  console.log("userId:", userId);

  useEffect(() => {
    const fetchQrCode = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/2fa/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userEmail }),
        });
        if (!res.ok) throw new Error("QRコードの取得に失敗しました");
        const data = await res.json();
        setQrCodeUrl(data.qrCodeDataUrl);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("予期しないエラーが発生しました");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQrCode();
  }, [userId, userEmail]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-xl font-bold mb-4">2段階認証セットアップ</h1>
      {loading && <p>QRコードを生成中...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {qrCodeUrl && (
        <div className="flex flex-col items-center">
          <Image
            src={qrCodeUrl}
            alt="2FA QRコード"
            width={200}
            height={200}
            className="mb-2"
          />
          <p>認証アプリでQRコードをスキャンしてください。</p>
        </div>
      )}
    </main>
  );
};

export default Page;