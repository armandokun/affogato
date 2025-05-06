import { createClient } from "./supabase/server";

const getServerSession = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  return data;
};

export default getServerSession;
