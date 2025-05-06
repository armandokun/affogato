import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu/dropdown-menu";

import { signOut } from "@/app/login/actions";

const DropdownAvatarContentMenu = () => {
  return (
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
  );
};

export default DropdownAvatarContentMenu;
