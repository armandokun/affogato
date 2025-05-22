"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Users, Search } from "lucide-react";
import Link from "next/link";

import useIsMobile from "@/hooks/use-mobile";
import useLibraryItems from "@/hooks/use-library-items";

import Sidebar from "./sidebar";
import SidebarContentPanel from "./content-panel";
import MobileSidebar from "./mobile-sidebar";

export const MENU = [
  {
    key: "home",
    icon: Search,
    show: true,
    label: "Home",
    href: "/dashboard",
  },
  {
    key: "spaces",
    show: false,
    icon: Users,
    label: "Spaces",
    href: "/dashboard/spaces",
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { items: libraryItems, loading } = useLibraryItems();

  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [panelHovered, setPanelHovered] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isMobile = useIsMobile();

  const MENU = [
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
          <ul className="flex flex-col gap-1">
            {loading ? (
              <li className="text-xs text-muted-foreground p-2">Loading...</li>
            ) : (
              libraryItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/dashboard/${item.id}`}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-white rounded-md py-2"
                  >
                    <span className="truncate block max-w-[180px]">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))
            )}
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

  const [activeKey, setActiveKey] = useState(() => {
    return (
      MENU.find(
        (item) =>
          pathname === item.href || (pathname === "/" && item.key === "home")
      )?.key || MENU[0].key
    );
  });

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
