"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Users, Search } from "lucide-react";
import Link from "next/link";

import useIsMobile from "@/hooks/use-mobile";

import Sidebar from "./sidebar";
import SidebarContentPanel from "./content-panel";
import MobileSidebar from "./mobile-sidebar";

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
    show: true,
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
    show: false,
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

const AppSidebar = () => {
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
      <MobileSidebar
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        pathname={pathname}
      />
    );
  }

  return (
    <aside>
      <Sidebar
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        setHoveredKey={setHoveredKey}
        setSidebarHovered={setSidebarHovered}
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
