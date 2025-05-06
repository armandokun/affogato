import AppSidebar from "@/components/general/sidebar/app-sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-black rounded-md">
      <AppSidebar />
      <div className="flex-1 bg-background rounded-lg m-2 md:ml-0 mt-0 md:mt-2">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
