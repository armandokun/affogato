import { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";

type Props = {
  title: string;
  pendingTitle: string;
  formAction: (formData: FormData) => Promise<void>;
  children?: ReactNode;
  className?: string;
} & ComponentProps<"button">;

const AuthSubmitButton = ({
  title,
  pendingTitle,
  className,
  formAction,
  children,
  ...props
}: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      formAction={formAction}
      className={cn("w-full flex justify-center gap-2", className)}
      disabled={pending}
      {...props}
    >
      <span
        style={{ width: 20, display: "inline-flex", justifyContent: "center" }}
      >
        {pending && <Loader className="text-muted-foreground animate-spin" />}
      </span>
      {children}
      {pending ? pendingTitle : title}
    </Button>
  );
};

export default AuthSubmitButton;
