"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Label, Separator } from "radix-ui";
import React, { FormEvent, useEffect, useState } from "react";
import { redirect } from "next/navigation";

import Button from "@/components/ui/button";
import Icons from "@/components/general/icons";
import { createClient } from "@/lib/supabase/client";
import { DASHBOARD } from "@/constants/routes";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [isSignUp]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (isSignUp) {
      await signupWithPassword(formData);
    } else {
      await loginWithPassword(formData);
    }

    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setErrorMessage(error.message);

    if (data.url) {
      window.location.href = data.url;
    }

    setLoading(false);
  };

  const loginWithPassword = async (formData: FormData) => {
    setErrorMessage(null);

    const supabase = createClient();

    const data = {
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setErrorMessage(error.message);

      return;
    }

    redirect(DASHBOARD);
  };

  const signupWithPassword = async (formData: FormData) => {
    setErrorMessage(null);

    const supabase = createClient();

    const data = {
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      setErrorMessage(error.message);

      return;
    }

    setSuccessMessage("Please check your email for a confirmation link.");
  };

  return (
    <div className="flex flex-col justify-center mx-auto px-6 py-12 gap-8 max-w-md h-full">
      <div className="flex flex-col items-start gap-8">
        <Link href="/">
          <Icons.logo className="size-10" />
        </Link>
        <h1 className="text-3xl font-bold">
          The start of <br />
          something great.
        </h1>
      </div>
      <div className="flex flex-col gap-3 w-full mt-2">
        <Button
          variant="outline"
          className="w-full flex gap-2 justify-center"
          onClick={() => handleOAuthSignIn("google")}
          disabled={loading}
        >
          <Icons.google /> Continue with Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex gap-2 justify-center"
          onClick={() => handleOAuthSignIn("github")}
          disabled={loading}
        >
          <GitHubLogoIcon className="size-5" /> Continue with GitHub
        </Button>
      </div>
      <div className="flex items-center gap-2 my-2 w-full">
        <Separator.Root className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator.Root className="flex-1 h-px bg-border" />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 text-sm mb-2">{successMessage}</div>
      )}
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div>
          <Label.Root
            htmlFor="email"
            className="block text-sm font-medium mb-1"
          >
            Email
          </Label.Root>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ada@lovelace.com"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 justify-between">
            <Label.Root
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </Label.Root>
            {!isSignUp && (
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading
            ? isSignUp
              ? "Signing up..."
              : "Signing in..."
            : isSignUp
            ? "Sign up"
            : "Sign in"}
        </Button>
      </form>
      <div className="flex justify-center text-sm text-muted-foreground w-full">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-primary underline ml-1 p-0 h-auto text-sm"
              type="button"
              onClick={() => setIsSignUp(false)}
            >
              Sign in
            </Button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="text-primary underline ml-1 p-0 h-auto text-sm"
              type="button"
              onClick={() => setIsSignUp(true)}
            >
              Sign up
            </Button>
          </>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground w-full text-center">
        By using Affogato, you agree to our{" "}
        <Link href="/terms" className="text-primary underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
};

export default LoginPage;
