"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import LogoButton from "./logo-button";
import NewThreadButton from "./new-thread-button";
import { MENU } from "./app-sidebar";
import SidebarUserAvatarButton from "./user-avatar-button/user-avatar-button";

const Sidebar = ({
  activeKey,
  setActiveKey,
  setHoveredKey,
  setSidebarHovered,
}: {
  activeKey: string;
  setActiveKey: (k: string) => void;
  setHoveredKey: (k: string | null) => void;
  setSidebarHovered: (v: boolean) => void;
}) => {
  return (
    <nav
      className="relative z-30 h-full flex flex-col justify-between bg-black border-none shadow-none w-18 items-center py-4"
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      <div className="flex flex-col items-center gap-6">
        <LogoButton />
        <NewThreadButton />
      </div>
      <div className="flex flex-col gap-2 items-center mt-8 flex-1">
        {MENU.map((item) => {
          const isActive = activeKey === item.key;

          return (
            <div
              key={item.key}
              className="relative w-full flex justify-center"
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center size-18 rounded-xl transition-colors group"
                aria-label={item.label}
                onClick={() => setActiveKey(item.key)}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full mb-1 size-10 transition-colors",
                    isActive
                      ? "bg-[#313232]"
                      : "group-hover:bg-[#282929] group-hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "transition-transform duration-200 ease-in-out",
                      "group-hover:scale-110",
                      isActive && "scale-110"
                    )}
                  >
                    <item.icon
                      size={20}
                      className={isActive ? "text-white" : "text-[#8b8c8c]"}
                    />
                  </span>
                </div>
                <span
                  className={`text-xs ${
                    isActive
                      ? "text-white font-medium"
                      : "text-[#8b8c8c] font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
      <SidebarUserAvatarButton />
    </nav>
  );
};

export default Sidebar;
