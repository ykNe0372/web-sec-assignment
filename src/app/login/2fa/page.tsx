"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page: React.FC = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const userEmail = searchParams.get("userEmail");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token }),
      });
      const data = await res.json();
      if (data.success) {
        router.replace("/"); // 認証成功時にトップページ等へ遷移
      } else {
        setError(data.message || "認証に失敗しました");
      }
    } catch (e) {
      setError("通信エラーが発生しました");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-xl font-bold mb-4">2段階認証コード入力</h1>
      <form onSubmit={handleVerify} className="flex flex-col items-center gap-2">
        <input
          type="text"
          maxLength={6}
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="6桁コード"
          className="border px-2 py-1 rounded text-center text-lg tracking-widest"
          disabled={isPending}
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
          disabled={isPending || token.length !== 6}
        >
          認証
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
};

export default Page;