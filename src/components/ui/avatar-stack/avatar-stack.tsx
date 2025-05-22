/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";

type Avatar = {
  imageUrl: string;
  linkUrl: string;
};

type Props = {
  className?: string;
  avatarCount?: number;
  avatars: Array<Avatar>;
};

const AvatarStack = ({ avatarCount, className, avatars }: Props) => {
  return (
    <div className={cn("z-10 flex -space-x-1", className)}>
      {avatars.map((avatar, index) => (
        <a
          key={index}
          href={avatar.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            key={index}
            className="size-6 rounded-full border-2 border-border bg-black"
            src={avatar.imageUrl}
            width={40}
            height={40}
            alt={`Avatar ${index + 1}`}
          />
        </a>
      ))}
      {(avatarCount ?? 0) > 0 && (
        <a
          className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
          href=""
        >
          +{avatarCount}
        </a>
      )}
    </div>
  );
};

export default AvatarStack;
