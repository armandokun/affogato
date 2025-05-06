import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu/dropdown-menu";

import { signOut } from "@/app/login/actions";
import { SETTINGS } from "@/constants/routes";

type Props = {
  onClose: () => void;
};

const DropdownAvatarContentMenu = ({ onClose }: Props) => {
  const handleSignOut = async () => {
    await signOut();

    onClose();
  };

  return (
    <DropdownMenuContent className="mx-4" side="top" align="end">
      <DropdownMenuItem className="cursor-pointer" onClick={onClose}>
        <Link href={SETTINGS} className="flex items-center gap-4 w-full">
          <Settings />
          <p className="text-sm font-medium">Settings</p>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleSignOut}
        className="flex items-center gap-4 w-full cursor-pointer"
      >
        <LogOut />
        <p className="text-sm font-medium">Sign Out</p>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default DropdownAvatarContentMenu;
