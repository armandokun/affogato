import Link from "next/link";
import { Library, Menu, SidebarClose } from "lucide-react";

import Button from "@/components/ui/button/button";
import { SheetContent } from "@/components/ui/sheet/sheet";
import { Sheet, SheetClose, SheetTitle } from "@/components/ui/sheet/sheet";
import useLibraryItems from "@/hooks/use-library-items";

import Icons from "../icons";
import { MENU } from "./app-sidebar";
import SidebarUserAvatarButton from "./user-avatar-button/user-avatar-button";

type Props = {
  isSheetOpen: boolean;
  setIsSheetOpen: (isOpen: boolean) => void;
  pathname: string;
};

const MobileSidebar = ({ isSheetOpen, setIsSheetOpen, pathname }: Props) => {
  const { items: libraryItems, loading: loadingLibrary } = useLibraryItems();

  return (
    <>
      <header className="flex items-center gap-2 h-12 px-2 bg-black rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground"
          onClick={() => setIsSheetOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
        <Link href="/" className="flex items-center gap-1">
          <Icons.logo />
          <span className="text-lg font-semibold">Affogato</span>
        </Link>
      </header>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="left"
          className="w-56 p-2 bg-background h-full flex flex-col"
        >
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <Icons.logo className="size-6 ml-2" />
                <p>Affogato</p>
              </div>
            </SheetTitle>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground"
              >
                <SidebarClose className="size-5" />
              </Button>
            </SheetClose>
          </div>
          <div className="overflow-y-auto flex-8/10">
            <div className="flex flex-col gap-1 py-4">
              {MENU.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    href={item.href}
                    key={item.key}
                    className={`flex items-center gap-2 font-medium hover:bg-accent rounded-md p-2 ${
                      isActive ? "text-white" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="flex items-center gap-2 font-medium hover:bg-accent rounded-md p-2 text-muted-foreground">
                <Library size={20} />
                <span>Library</span>
              </div>
              <ul className="flex flex-col gap-1 ml-4">
                <div className="relative pl-4 border-l border-muted-foreground/50">
                  {loadingLibrary ? (
                    <li className="text-xs text-muted-foreground p-2">
                      Loading...
                    </li>
                  ) : (
                    libraryItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/dashboard/${item.id}`}
                          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-white rounded-md p-2"
                        >
                          <span className="truncate block max-w-[160px]">
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))
                  )}
                </div>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full">
              <SidebarUserAvatarButton />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
