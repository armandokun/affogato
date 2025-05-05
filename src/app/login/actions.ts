"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const signOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) redirect("/error");

  redirect("/");
};
