import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip/tooltip";

const NewThreadButton = () => {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          className="size-10 flex items-center justify-center rounded-full bg-[#282929] group hover:bg-[#313232] transition-colors duration-200 ease-in-out cursor-pointer"
        >
          <span className="transition-transform duration-200 ease-in-out group-hover:scale-110">
            <Plus size={20} className="text-white" />
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        New Thread
      </TooltipContent>
    </Tooltip>
  );
};

export default NewThreadButton;
