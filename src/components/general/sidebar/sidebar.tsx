"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";

import LogoButton from "./logo-button";
import NewThreadButton from "./new-thread-button";
import { MENU } from "./app-sidebar";
import { Settings, LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";

const Sidebar = ({
  activeKey,
  setActiveKey,
  setHoveredKey,
  setSidebarHovered,
  user,
}: {
  activeKey: string;
  setActiveKey: (k: string) => void;
  setHoveredKey: (k: string | null) => void;
  setSidebarHovered: (v: boolean) => void;
  user: User;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      className="fixed left-0 top-0 z-30 h-screen flex flex-col justify-between bg-[#232424] border-none shadow-none w-18 items-center py-4"
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => {
        if (!dropdownOpen) setSidebarHovered(false);
      }}
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
      <div className="flex flex-col items-center">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-14 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.user_metadata.avatar_url}
                alt="User avatar"
                className="w-full h-full object-cover rounded-full"
                width={32}
                height={32}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mx-4" side="top" align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/settings" className="flex items-center gap-4 w-full">
                <Settings />
                <p className="text-sm font-medium">Settings</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="flex items-center gap-4 w-full cursor-pointer"
            >
              <LogOut />
              <p className="text-sm font-medium">Sign Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Sidebar;
