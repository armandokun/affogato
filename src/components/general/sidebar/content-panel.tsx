import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const SidebarContentPanel = ({
  showPanel,
  setPanelHovered,
  panelContent,
}: {
  showPanel: boolean;
  setPanelHovered: (isHovered: boolean) => void;
  panelContent: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "fixed top-0 left-[72px] h-screen w-56 bg-black shadow-lg p-6 z-20",
        "transition-transform duration-200 ease-in-out",
        showPanel
          ? "translate-x-0 pointer-events-auto"
          : "-translate-x-full pointer-events-none"
      )}
      onMouseEnter={() => setPanelHovered(true)}
      onMouseLeave={() => setPanelHovered(false)}
    >
      {panelContent}
    </div>
  );
};

export default SidebarContentPanel;
