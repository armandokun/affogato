"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { DASHBOARD } from "@/constants/routes";

export const signOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) redirect("/error");

  redirect("/");
};

export const signInWithPassword = async (
  prevState: { error: string; success: string },
  formData: FormData
) => {
  const supabase = await createClient();

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, success: "" };
  }

  redirect(DASHBOARD);
};

export const signUpWithPassword = async (
  prevState: { error: string; success: string },
  formData: FormData
) => {
  const supabase = await createClient();

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message, success: "" };
  }

  return {
    error: "",
    success: "Please check your email for a confirmation link.",
  };
};

export const signInWithOAuth = async (
  prevState: { error: string; success: string },
  formData: FormData
) => {
  const provider = formData.get("provider") as "google" | "github";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message, success: "" };

  if (data.url) redirect(data.url);

  return { error: "No redirect URL from provider.", success: "" };
};
