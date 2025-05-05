"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const loginWithPassword = async (formData: FormData) => {
  const supabase = await createClient();

  const data = {
    email: formData.get("email")!.toString(),
    password: formData.get("password")!.toString(),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) redirect("/error");

  revalidatePath("/", "layout");
  redirect("/dashboard");
};

export const signupWithPassword = async (formData: FormData) => {
  const supabase = await createClient();

  const data = {
    email: formData.get("email")!.toString(),
    password: formData.get("password")!.toString(),
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) redirect("/error");

  revalidatePath("/", "layout");
  redirect("/dashboard");
};

export const signInWithOAuth = async (provider: "google" | "github") => {
  const supabase = await createClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ??
      process?.env?.NEXT_PUBLIC_VERCEL_URL ??
      "http://localhost:3000";

    url = url.startsWith("http") ? url : `https://${url}`;
    url = url.endsWith("/") ? url.slice(0, -1) : url;
    return url;
  };

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL()}/auth/callback`,
    },
  });

  if (error) redirect("/error");

  revalidatePath("/", "layout");
  redirect(data.url);
};

export const signOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  redirect("/");
};
