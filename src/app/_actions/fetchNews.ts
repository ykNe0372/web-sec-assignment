"use server";

import { prisma } from "@/libs/prisma";
import { Region, NewsItem } from "@prisma/client";
import type { ServerActionResponse } from "@/app/_types/ServerActionResponse";

export const fetchNewsServerAction = async (
  region: Region,
): Promise<ServerActionResponse<NewsItem[]>> => {
  const newsItems: NewsItem[] = await prisma.newsItem.findMany({
    where: { region },
    orderBy: { publishedAt: "desc" },
  });
  const res: ServerActionResponse<NewsItem[]> = {
    success: true,
    data: newsItems,
    message: "",
  };

  return res;
};
