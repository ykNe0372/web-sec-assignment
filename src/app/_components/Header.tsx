"use client";

import { useAuth } from "@/app/_hooks/useAuth";
import NextLink from "next/link";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";

import { twMerge } from "tailwind-merge";
import { AUTH } from "@/config/auth";

export const Header: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const router = useRouter();

  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-3xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white",
          )}
        >
          <div>
            <NextLink href="/">
              <FontAwesomeIcon icon={faUserLock} className="mr-1.5" />
              ガチガチにセキュアな設計
            </NextLink>
            <span className="ml-1 text-xs font-normal">
              {AUTH.isSession ? "- Session Auth" : "- JWT Auth"}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div
              className={twMerge("text-sm text-slate-400 cursor-pointer hover:text-white ")}
              onClick={() => {
                router.push("/signup");
              }}
              >
              Sign up
            </div>
            {userProfile ? (
              <div className="ml-2 text-sm text-slate-400">
                <div className="flex items-center gap-x-2">
                  <div className="text-slate-200">{userProfile.name}</div>
                  <div
                    className={twMerge("cursor-pointer hover:text-white")}
                    onClick={logout}
                    >
                    Sign out
                  </div>
                </div>
              </div>
            ) : (
              <div
              className={twMerge(
                "ml-2 text-sm text-slate-400",
                "cursor-pointer hover:text-white",
              )}
              onClick={() => {
                router.push("/login");
              }}
              >
                Sign in
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
