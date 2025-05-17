import { Avatar } from "radix-ui";
import { ReactNode } from "react";

const TestimonialCard = ({
  avatarUrl,
  name,
  role,
  children,
}: {
  avatarUrl: string;
  name: string;
  role: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 shadow-lg flex flex-col gap-6 max-w-lg w-full border border-white/10">
      <div className="flex items-center gap-4">
        <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
          <Avatar.Image
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-muted text-lg font-bold">
            {name[0]}
          </Avatar.Fallback>
        </Avatar.Root>
        <div>
          <div className="font-medium text-lg text-white leading-tight">
            {name}
          </div>
          <div className="text-accent-foreground/70 text-sm">{role}</div>
        </div>
      </div>
      <div className="text-base text-white/90 leading-relaxed">{children}</div>
    </div>
  );
};

export default TestimonialCard;
