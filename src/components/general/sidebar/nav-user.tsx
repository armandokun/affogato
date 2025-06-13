"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";

import useSidebar from "@/hooks/use-sidebar";
import { useSession } from "@/containers/SessionProvider";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/login/actions";
import { DASHBOARD_PRICING } from "@/constants/routes";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";

export function NavUser() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const { isMobile } = useSidebar();
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const fetchCurrentPlan = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_name")
        .eq("user_id", user.id)
        .single();

      if (error) return;

      setCurrentPlan(data?.plan_name);
    };

    fetchCurrentPlan();
  }, [user?.id]);

  if (!user) return null;

  const getInitials = () => {
    const name = user.user_metadata?.full_name?.trim();

    if (name) {
      const words = name.split(/\s+/).filter(Boolean);
      const initials = words
        .slice(0, 2)
        .map((word: string) => word[0].toUpperCase())
        .join("");

      return initials || "?";
    }

    const email = user.email || "";
    const username = email.split("@")[0];

    if (username.length >= 2) {
      return (username[0] + username[1]).toUpperCase();
    } else if (username.length === 1) {
      return username[0].toUpperCase();
    }

    return "?";
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.user_metadata.avatar_url}
                  alt="User avatar"
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.user_metadata.full_name || user.email}
                </span>
                <span className="truncate text-xs">{`${currentPlan} plan`}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    alt="User avatar"
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.user_metadata.full_name || user.email}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(DASHBOARD_PRICING)}>
                <Sparkles />
                View plans
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
