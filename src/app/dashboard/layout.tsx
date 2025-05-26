"use client";

import { useState } from "react";
import {
  Book,
  Library,
  MessageCircle,
  MessagesSquare,
  Plus,
  PlusCircle,
  Search,
  Users,
} from "lucide-react";
import Image from "next/image";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Logo, LogoIcon } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import useLibraryItems from "@/hooks/use-library-items";
import { useSession } from "@/containers/SessionProvider";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { items: libraryItems, loading } = useLibraryItems();
  const { user } = useSession();

  const links = [
    {
      label: "New Chat",
      href: "/dashboard",
      icon: (
        <Plus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chats",
      href: "#",
      icon: (
        <MessagesSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="flex h-screen flex-col md:flex-row bg-black rounded-md">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            {libraryItems.length > 0 && (
              <div className="flex flex-col gap-1">
                {loading ? (
                  <div className="text-xs text-neutral-500 px-2">
                    Loading...
                  </div>
                ) : (
                  libraryItems.map((item) => (
                    <Link key={item.id} href={`/dashboard/${item.id}`} />
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <SidebarLink
              link={{
                label:
                  user?.user_metadata?.name.split(" ")[0] ||
                  user?.email ||
                  "User Profile",
                href: "/dashboard/profile",
                icon: (
                  <img
                    src={
                      user?.user_metadata?.avatar_url ||
                      "https://github.com/shadcn.png"
                    }
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={28}
                    height={28}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 bg-background rounded-lg m-2 md:ml-0 mt-0 md:mt-2">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
