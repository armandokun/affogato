import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type PricingTabsProps = {
  activeTab: "yearly" | "monthly";
  setActiveTab: (tab: "yearly" | "monthly") => void;
  className?: string;
};

const PricingTabs = ({
  activeTab,
  setActiveTab,
  className,
}: PricingTabsProps) => {
  return (
    <div
      className={cn(
        "relative flex w-fit items-center rounded-full border p-0.5 backdrop-blur-sm cursor-pointer h-9 flex-row bg-muted",
        className
      )}
    >
      {["monthly", "yearly"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as "yearly" | "monthly")}
          className={cn(
            "relative z-[1] px-2 h-8 flex items-center justify-center cursor-pointer",
            {
              "z-0": activeTab === tab,
            }
          )}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-full bg-[#3F3F46] shadow-md border border-border"
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25,
                velocity: 2,
              }}
            />
          )}
          <span
            className={cn(
              "relative block text-sm font-medium duration-200 shrink-0",
              activeTab === tab ? "text-primary" : "text-muted-foreground"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "yearly" && (
              <span
                className="ml-2 text-xs font-semibold py-0.5 w-[calc(100%+1rem)] px-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #FF8A00 0%, #FF6F91 50%, #4F8CFF 100%)",
                  color: "white",
                }}
              >
                -20%
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PricingTabs;
