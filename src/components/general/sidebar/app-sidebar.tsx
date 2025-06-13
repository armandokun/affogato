"use client";

import { ComponentProps } from "react";
import { LockIcon, SquarePen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PlanName } from "@/constants/user";
import { useSubscription } from "@/hooks/use-subscription";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenuButton,
} from "./sidebar";
import Icons from "../icons";
import { NavUser } from "./nav-user";
import NavHistory from "./nav-history";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { currentPlan } = useSubscription();

  const disabled = currentPlan?.toLocaleLowerCase() === PlanName.FREE;

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row justify-between m-2 items-center">
            <Link href="/">
              <div className="flex flex-row gap-2 leading-none items-center">
                <Icons.logo className="size-6" />
                <span className="text-md font-medium">Affogato</span>
              </div>
            </Link>
            <SidebarTrigger className="-ml-1" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mx-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col gap-2">
            <SidebarMenuButton
              className="flex flex-row justify-between"
              onClick={() => {
                if (disabled) return;

                router.push("/dashboard");
              }}
            >
              <div className="flex items-center gap-2">
                <SquarePen className="size-4" />
                <span className="text-sm font-medium">New Chat</span>
              </div>
              {disabled && <LockIcon className="size-4" />}
            </SidebarMenuButton>
            {disabled && (
              <p className="text-xs text-muted-foreground ml-2">
                Unlock chat creation by upgrading a plan.
              </p>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
        <NavHistory />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
