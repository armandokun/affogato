"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { encodedRedirect } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DASHBOARD, LOGIN } from "@/constants/routes";
import { toast } from "@/components/ui/toast/toast";

export const signOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) return toast({ description: error.message, type: "error" });

  redirect(LOGIN);
};

export const signInWithPassword = async (formData: FormData) => {
  const supabase = await createClient();

  const data = {
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) return encodedRedirect("error", LOGIN, error.message);

  revalidatePath("/", "layout");
  redirect(DASHBOARD);
};

export const signUpWithPassword = async (formData: FormData) => {
  const supabase = await createClient();

  const data = {
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  console.log(data);

  const { error } = await supabase.auth.signUp(data);

  if (error) return encodedRedirect("error", LOGIN, error.message);

  return encodedRedirect(
    "success",
    LOGIN,
    "Please check your email for a confirmation link."
  );
};

export const signInWithOAuth = async (formData: FormData) => {
  const provider = formData.get("provider") as "google" | "github";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) return encodedRedirect("error", LOGIN, error.message);

  if (data.url) return redirect(data.url);

  return encodedRedirect("error", LOGIN, "No redirect URL from provider.");
};
