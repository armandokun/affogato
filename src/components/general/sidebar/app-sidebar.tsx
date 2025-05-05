"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Users, Search } from "lucide-react";

import Sidebar from "./sidebar";
import SidebarContentPanel from "./content-panel";
import { User } from "@supabase/supabase-js";

export const MENU = [
  {
    key: "home",
    icon: Search,
    label: "Home",
    href: "/dashboard",
    content: (
      <>
        <h2 className="text-lg font-bold mb-2">Home</h2>
        <p>Welcome to your dashboard.</p>
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

const AppSidebar = ({ user }: { user: User }) => {
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

  const showPanel = sidebarHovered || panelHovered;
  const panelContentKey = hoveredKey || activeKey;
  const panelContent = MENU.find(
    (item) => item.key === panelContentKey
  )?.content;

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
