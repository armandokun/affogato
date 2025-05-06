"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Users, Search, Menu, SidebarClose, Library } from "lucide-react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

import useIsMobile from "@/hooks/use-mobile";
import Button from "@/components/ui/button";

import Sidebar from "./sidebar";
import Icons from "../icons";
import SidebarContentPanel from "./content-panel";
import {
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet/sheet";
import { Sheet } from "@/components/ui/sheet/sheet";

export const LIBRARY = [
  {
    key: "saulius-krygeris-statistika",
    label: "saulius krygeris statistika",
  },
  {
    key: "saulius-krygeris",
    label: "saulius krygeris",
  },
  {
    key: "comuna-app",
    label: "comuna app",
  },
  {
    key: "vegetarian-burrito-recipe-rice",
    label: "vegetarian burrito recipe rice",
  },
  {
    key: "burrito-recipe",
    label: "burrito recipe",
  },
  {
    key: "for-all-mankind",
    label: "for all mankind",
  },
  {
    key: "rx3-rivian",
    label: "rx3 rivian",
  },
];

export const MENU = [
  {
    key: "home",
    icon: Search,
    label: "Home",
    href: "/dashboard",
    content: (
      <>
        <h2 className="text-lg font-medium">Home</h2>
        <div className="h-px bg-muted-foreground/50 my-2" />
        <Link
          href="/dashboard/library"
          className="text-sm text-muted-foreground font-medium hover:text-white hover:bg-accent rounded-md"
        >
          Library
        </Link>
        <ul className="flex flex-col gap-1">
          {LIBRARY.map((item) => (
            <li key={item.key}>
              <Link
                href={`/dashboard/library/${item.key}`}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-white rounded-md p-2"
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    key: "spaces",
    icon: Users,
    label: "Spaces",
    href: "/dashboard/spaces",
    content: (
      <>
        <h2 className="text-lg font-bold mb-2">Spaces</h2>
        <p>Your spaces and projects.</p>
      </>
    ),
  },
];

type Props = {
  user: User;
};

const AppSidebar = ({ user }: Props) => {
  const pathname = usePathname();

  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [panelHovered, setPanelHovered] = useState(false);
  const [activeKey, setActiveKey] = useState(() => {
    return (
      MENU.find(
        (item) =>
          pathname === item.href || (pathname === "/" && item.key === "home")
      )?.key || MENU[0].key
    );
  });
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isMobile = useIsMobile();

  const showPanel = sidebarHovered || panelHovered;
  const panelContentKey = hoveredKey || activeKey;
  const panelContent = MENU.find(
    (item) => item.key === panelContentKey
  )?.content;

  if (isMobile) {
    return (
      <>
        <header className="flex items-center gap-2 h-12 px-2">
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
          <SheetContent side="left" className="w-56 p-2">
            <SheetHeader>
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
            </SheetHeader>
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
              <Link
                href="/dashboard/library"
                className="flex items-center gap-2 font-medium hover:bg-accent rounded-md p-2 text-muted-foreground"
              >
                <Library size={20} />
                <span>Library</span>
              </Link>
              <ul className="flex flex-col gap-1 ml-4">
                <div className="relative pl-4 border-l border-muted-foreground/50">
                  {LIBRARY.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={`/dashboard/library/${item.key}`}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-white rounded-md p-2"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <aside>
      <Sidebar
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        setHoveredKey={setHoveredKey}
        setSidebarHovered={setSidebarHovered}
        user={user}
      />
      <SidebarContentPanel
        showPanel={showPanel}
        setPanelHovered={setPanelHovered}
        panelContent={panelContent}
      />
    </aside>
  );
};

export default AppSidebar;
