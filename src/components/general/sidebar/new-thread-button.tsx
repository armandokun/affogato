import { Plus } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip/tooltip";

const NewThreadButton = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="size-10 flex items-center justify-center rounded-full bg-[#282929] group cursor-pointer hover:bg-[#313232] transition-colors duration-200 ease-in-out">
          <span className="transition-transform duration-200 ease-in-out group-hover:scale-110">
            <Plus size={20} className="text-white" />
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        New Thread
      </TooltipContent>
    </Tooltip>
  );
};

export default NewThreadButton;
