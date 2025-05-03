import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Label, Separator } from "radix-ui";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import TestimonialCard from "@/components/testimonial-card";

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
          </form>
          <div className="flex justify-center mt-2 text-xs text-muted-foreground w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline ml-1">
              Sign In
            </Link>
          </div>
          <div className="mt-2 text-sm text-muted-foreground w-full text-center">
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
      </div>
      <div className="hidden lg:flex flex-1 lg:w-1/2 lg:basis-1/2 items-center justify-center relative rounded-2xl m-6 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="/login.jpeg"
            alt="Login"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
          <div className="flex items-center gap-4">
            <TestimonialCard
              avatarUrl="https://github.com/shadcn.png"
              name="Ada Lovelace"
              role="CEO, The First Computer Company"
            >
              &quot;That guy with his lava lamp inspired designs... Where are
              you going to put them next??&quot;
            </TestimonialCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
