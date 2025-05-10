import { LogOut } from "lucide-react";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { signOut } from "@/app/login/actions";

type Props = {
  onClose: () => void;
};

const DropdownAvatarContentMenu = ({ onClose }: Props) => {
  const handleSignOut = async () => {
    onClose();

    await signOut();
  };

  return (
    <DropdownMenuContent className="mx-4" side="top" align="end">
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
