import { createClient } from "./supabase/server";

const getServerSession = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return data?.user;
};

export default getServerSession;
