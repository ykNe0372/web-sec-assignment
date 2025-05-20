"use client";

import { use, useEffect, useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faSquareRss,
  faRss,
  faStreetView,
} from "@fortawesome/free-solid-svg-icons";

import { Region } from "@prisma/client";
import { NewsItem } from "@prisma/client";
import { regionDisplayNames } from "@/app/_types/Region";
import type { ApiResponse } from "@/app/_types/ApiResponse";

const Page: React.FC = () => {
  const ep = "/api/news";
  const [region, setRegion] = useState<Region>(Region.OSAKA);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [regionDisplayName, setRegionDisplayName] = useState<string>("");

  // 初回 と region変更のタイミングでニュース記事を取得【基本的な実装】
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/news", {
          method: "GET",
          credentials: "same-origin", // Cookieも送信
          cache: "no-store",
        });
        const data: ApiResponse<NewsItem[]> = await res.json();
        if (data.success) {
          setNewsItems(data.payload);
        } else {
          console.error(data.message);
        }
      } catch (e) {
        console.error("ニュース記事取得失敗", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [region]);

  //【💡SWRを利用した実装】
  // const fetcher = useCallback(async (endPoint: string) => {
  //   const res = await fetch(endPoint, {
  //     credentials: "same-origin",
  //     cache: "no-store",
  //   });
  //   return res.json();
  // }, []);

  // const { data: news, isLoading } = useSWR<ApiResponse<NewsItem[]>>(
  //   ep,
  //   fetcher,
  // );

  // useEffect(() => {
  //   if (news && news.success) setNewsItems(news.payload);
  // }, [news]);

  // useEffect(() => {
  //   mutate(ep); // 再検証(キャッシュ無効化して再取得)
  // }, [region]);

  useEffect(() => {
    setRegionDisplayName(regionDisplayNames[region]);
  }, [region]);

  // 地域の変更操作
  const changeRegion = async (newRegion: Region) => {
    if (region === newRegion) return;
    console.log("newRegion:", newRegion);
    setRegion(newRegion);
    // Cookieに保存（クライアントサイドで Cookie を直接操作）
    Cookies.set("region", newRegion, {
      expires: 7,
      path: "/api/news",
      sameSite: "strict",
      secure: false, // 本番環境(HTTPS)では true にすべき
    });
    // 👆 セキュアに利用する観点から各設定の意味を調べてみてください
  };

  // データの取得中の画面出力
  if (isLoading) {
    return (
      <main>
        <div className="text-2xl font-bold">
          <FontAwesomeIcon icon={faSquareRss} className="mr-1.5" />
          Local Tech News
        </div>
        <div className="mt-4 flex items-center gap-x-2">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-gray-500"
          />
          <div>Loading... </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="text-2xl font-bold">
        <FontAwesomeIcon icon={faSquareRss} className="mr-1.5" />
        Local Tech News ({regionDisplayName})
      </div>
      <div className="mt-4 ml-4 flex flex-col space-y-2">
        {newsItems.map((p) => (
          <div key={p.id} className="cursor-pointer hover:underline">
            <FontAwesomeIcon icon={faRss} className="mr-2 text-slate-600" />
            {p.title}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-x-3">
        <div className="text-blue-500">
          <FontAwesomeIcon icon={faStreetView} className="mr-1" />
          地域を選択
        </div>
        <div>
          <select
            onChange={async (e) => await changeRegion(e.target.value as Region)}
            value={region}
            className="border-2 px-1"
          >
            {Object.values(Region).map((regionValue) => (
              <option key={regionValue} value={regionValue}>
                {regionDisplayNames[regionValue]} ({regionValue})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        ※ デベロッパーツール (F12)
        を起動して「アプリケーション」から「ストレージ」の「Cookie」を確認してください。
      </div>
    </main>
  );
};

export default Page;
