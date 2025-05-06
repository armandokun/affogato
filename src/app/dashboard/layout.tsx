import AppSidebar from "@/components/general/sidebar/app-sidebar";
import { createClient } from "@/lib/supabase/server";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <AppSidebar user={user.user} />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default DashboardLayout;
