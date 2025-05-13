"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Label, Separator } from "radix-ui";
import React, { useActionState, useState } from "react";

import Button from "@/components/ui/button";
import Icons from "@/components/general/icons";
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithOAuth,
} from "@/app/login/actions";

const initialState = { error: "", success: "" };

const LoginSection = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [loginState, loginAction] = useActionState(
    signInWithPassword,
    initialState
  );
  const [signupState, signupAction] = useActionState(
    signUpWithPassword,
    initialState
  );
  const [oauthState, oauthAction] = useActionState(
    signInWithOAuth,
    initialState
  );

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
        <form action={oauthAction} className="w-full">
          <input type="hidden" name="provider" value="google" />
          <Button
            variant="outline"
            className="w-full flex gap-2 justify-center"
            type="submit"
          >
            <Icons.google /> Continue with Google
          </Button>
        </form>
        <form action={oauthAction} className="w-full">
          <input type="hidden" name="provider" value="github" />
          <Button
            variant="outline"
            className="w-full flex gap-2 justify-center"
            type="submit"
          >
            <GitHubLogoIcon className="size-5" /> Continue with GitHub
          </Button>
        </form>
        {oauthState?.error && oauthState.error !== "" && (
          <div className="text-red-500 text-sm mb-2">{oauthState.error}</div>
        )}
      </div>
      <div className="flex items-center gap-2 my-2 w-full">
        <Separator.Root className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator.Root className="flex-1 h-px bg-border" />
      </div>
      {!isSignUp ? (
        <form className="flex flex-col gap-4 w-full" action={loginAction}>
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
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground underline"
              >
                Forgot password?
              </Link>
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
          <Button type="submit" className="w-full mt-2">
            Sign in
          </Button>
          {loginState?.error && (
            <div className="text-red-500 text-sm mb-2">{loginState.error}</div>
          )}
        </form>
      ) : (
        <form className="flex flex-col gap-4 w-full" action={signupAction}>
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
            <Label.Root
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </Label.Root>
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
          <Button type="submit" className="w-full mt-2">
            Sign up
          </Button>
          {signupState?.error && (
            <div className="text-red-500 text-sm mb-2">{signupState.error}</div>
          )}
          {signupState?.success && (
            <div className="text-green-500 text-sm mb-2">
              {signupState.success}
            </div>
          )}
        </form>
      )}
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

export default LoginSection;
