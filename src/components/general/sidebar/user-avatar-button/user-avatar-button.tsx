"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useSession } from "@/containers/SessionProvider";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu/dropdown-menu";
import Button from "@/components/ui/button/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu/dropdown-menu";

import DropdownAvatarContentMenu from "./avatar-dropdown-content";
import UserAvatar from "./user-avatar";

type Props = {
  onClose: () => void;
};

const SidebarUserAvatarButton = ({ onClose }: Props) => {
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
                <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} />
              </Button>
              <Button
                className="flex md:hidden rounded-full p-2 w-full h-12"
                variant="outline"
              >
                <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} />
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
          <DropdownAvatarContentMenu
            onClose={() => {
              onClose();

              setIsOpen(false);
            }}
          />
        </DropdownMenu>
      </div>
    </>
  );
};

export default SidebarUserAvatarButton;
