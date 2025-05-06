import { redirect } from "next/navigation";
import { ArrowUp, Globe, Paperclip } from "lucide-react";

import Button from "@/components/ui/button";
import Icons from "@/components/general/icons";
import getServerSession from "@/lib/auth";

const DashboardPage = async () => {
  const user = await getServerSession();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <div className="flex flex-col items-center mb-10">
        <Icons.logo className="w-20 h-20 mb-4" />
        <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
          Affogato
        </h1>
      </div>
      <div className="w-full max-w-xl flex flex-col items-center mb-8">
        <div className="flex w-full items-center bg-[#18181b] border border-[#232329] rounded-full shadow-lg px-2 py-1 gap-2 focus-within:ring-2 focus-within:ring-primary/40 transition">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
          >
            <Globe className="w-5 h-5" />
          </Button>
          <input
            type="text"
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none px-2 py-3 text-lg text-white placeholder:text-muted-foreground rounded-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button size="icon" className="rounded-full">
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
