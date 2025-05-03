import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import { signOut } from "../login/actions";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user.email}</p>
      <form action={signOut}>
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
};

export default DashboardPage;
