"use client";

import { useAuth } from "@/app/_hooks/useAuth";
import NextLink from "next/link";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { twMerge } from "tailwind-merge";
import { AUTH } from "@/config/auth";
import { useState, useRef, useEffect } from "react";

export const Header: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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
          <div className="relative" ref={menuRef}>
            <button
              className="text-slate-400 hover:text-white"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            {menuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-32 bg-white rounded border border-slate-400 z-10 text-slate-800">
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />
                {!userProfile && (
                  <>
                    <div
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100"
                      onClick={() => {
                        router.push("/signup");
                        setMenuOpen(false);
                      }}
                    >
                      サインアップ
                    </div>
                    <div
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100"
                      onClick={() => {
                        router.push("/login");
                        setMenuOpen(false);
                      }}
                    >
                      サインイン
                    </div>
                  </>
                )}
                {userProfile && (
                  <>
                    <div className="px-4 py-2 text-sm text-slate-500">{userProfile.name}</div>
                    <div
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                    >
                      サインアウト
                    </div>
                    <div
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100"
                      onClick={() => {
                        router.push(`/2fa?userId=${encodeURIComponent(userProfile.id)}&userEmail=${encodeURIComponent(userProfile.email)}`);
                        setMenuOpen(false);
                      }}
                      >
                      2段階認証
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
