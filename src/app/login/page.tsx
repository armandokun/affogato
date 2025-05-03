import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Avatar, Checkbox, Label, Separator } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const LoginPage = () => {
  return (
    <div className="flex-row flex items-stretch justify-center bg-background min-h-screen">
      <div className="w-full lg:w-1/2">
        <div className="flex flex-col justify-center mx-auto px-6 py-12 gap-8 max-w-md h-full">
          <div className="flex flex-col items-start gap-8">
            <Link href="/">
              <Icons.logo className="size-10" />
            </Link>
            <h1 className="text-3xl font-bold">Affogato, anyone?</h1>
          </div>
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              variant="outline"
              className="w-full flex gap-2 justify-center"
            >
              <Icons.google /> Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex gap-2 justify-center"
            >
              <GitHubLogoIcon className="size-5" /> Continue with GitHub
            </Button>
          </div>
          <div className="flex items-center gap-2 my-2 w-full">
            <Separator.Root className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator.Root className="flex-1 h-px bg-border" />
          </div>
          <form className="flex flex-col gap-4 w-full">
            <div>
              <Label.Root
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Email
              </Label.Root>
              <input
                id="email"
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
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox.Root
                id="terms"
                className="accent-primary w-4 h-4 rounded border border-input flex items-center justify-center bg-background"
              >
                <Checkbox.Indicator className="text-primary">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 8l2.5 2.5L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Label.Root
                htmlFor="terms"
                className="text-xs text-muted-foreground"
              >
                Agree to our{" "}
                <a href="#" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </Label.Root>
            </div>
            <Button type="submit" className="w-full mt-2">
              Sign up
            </Button>
          </form>
          <div className="flex justify-center mt-2 text-xs text-muted-foreground w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 lg:w-1/2 lg:basis-1/2 items-center justify-center relative rounded-2xl m-6 overflow-hidden bg-black">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/login.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 shadow-lg flex flex-col gap-6 max-w-lg w-full border border-white/10 dark:border-white/10">
            <div className="flex items-center gap-4">
              <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                <Avatar.Image
                  src="https://pbs.twimg.com/profile_images/1362124432328888322/0p7r6Q1A_400x400.jpg"
                  alt="Kwinda Kramer"
                  className="w-full h-full object-cover"
                />
                <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-muted text-lg font-bold">
                  K
                </Avatar.Fallback>
              </Avatar.Root>
              <div>
                <div className="font-semibold text-lg text-black dark:text-white leading-tight">
                  Kwinda Kramer
                </div>
                <div className="text-muted-foreground text-sm font-medium">
                  CEO & Co-founder, Daily
                </div>
              </div>
            </div>
            <div className="text-base text-black dark:text-white/90 leading-relaxed">
              <p>
                Yeah, definitely take a look at{" "}
                <a
                  href="https://twitter.com/Vapi_AI"
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @Vapi_AI
                </a>
                . Really good developer ergonomics.
              </p>
              <br />
              <p>
                You can get started quickly, but their APIs also give you a lot
                of flexibility. And they've solved a bunch of the hard,
                low-level stuff so you don't have to worry about things like
                echo cancellation, picking the fastest endpoints if you're using
                Azure, web socket reconnection logic across different platforms,
                supporting WebRTC (apps, web pages) and PSTN (telephones) from
                the same codebase, etc etc etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
