import Link from "next/link";

import Button from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Sorry, something went wrong</h1>
        <Link href="/">
          <Button className="bg-secondary text-white rounded-full hover:bg-secondary/80 transition-colors">
            Go back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
