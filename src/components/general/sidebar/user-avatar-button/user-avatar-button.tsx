/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";

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
      <div className="flex flex-row items-center">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <div>
              <Button
                className="hidden md:flex rounded-full p-2 size-12 items-center justify-center"
                variant="ghost"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user?.user_metadata?.avatar_url || ""}
                    alt="User avatar"
                    className="object-cover rounded-full"
                    width={36}
                    height={36}
                  />
                ) : (
                  <User className="size-5 text-muted-foreground" />
                )}
              </Button>
              <Button
                className="flex md:hidden rounded-full p-2 w-full h-12"
                variant="outline"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user?.user_metadata?.avatar_url || ""}
                    alt="User avatar"
                    className="object-cover rounded-full"
                    width={36}
                    height={36}
                  />
                ) : (
                  <User className="size-4 text-muted-foreground" />
                )}
                <span className="text-sm font-semibold md:hidden text-muted-foreground truncate max-w-[120px]">
                  {user?.user_metadata?.name?.split(" ")[0] ||
                    user?.user_metadata.email}
                </span>
                {isOpen ? (
                  <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="ml-auto size-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownAvatarContentMenu onClose={() => setIsOpen(false)} />
        </DropdownMenu>
      </div>
    </>
  );
};

export default SidebarUserAvatarButton;
