"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useSession } from "@/containers/SessionProvider";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu/dropdown-menu";
import Button from "@/components/ui/button/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu/dropdown-menu";

import DropdownAvatarContentMenu from "./avatar-dropdown-content";

const SidebarUserAvatarButton = () => {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="flex flex-row items-center md:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full p-2 w-full h-12" variant="outline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user?.user_metadata?.avatar_url || ""}
                alt="User avatar"
                className="object-cover rounded-full"
                width={36}
                height={36}
              />
              <span className="text-sm font-semibold md:hidden text-muted-foreground">
                {user?.user_metadata?.name?.split(" ")[0]}
              </span>
              {isOpen ? (
                <ChevronUp className="ml-auto size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="ml-auto size-4 text-muted-foreground" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownAvatarContentMenu onClose={() => setIsOpen(false)} />
        </DropdownMenu>
      </div>
      <div className="hidden md:flex flex-col items-center">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full p-2 size-12" variant="ghost">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user?.user_metadata?.avatar_url || ""}
                alt="User avatar"
                className="object-cover rounded-full"
                width={36}
                height={36}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownAvatarContentMenu onClose={() => setIsOpen(false)} />
        </DropdownMenu>
      </div>
    </>
  );
};

export default SidebarUserAvatarButton;
