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

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
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
