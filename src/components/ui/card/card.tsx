import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import Tilt from "./tilt";

type Card = {
  children?: ReactNode;
  className?: string;
  tilt?: boolean;
};

const Card = ({ children, className, tilt = false }: Card) => {
  const CardContent = tilt ? Tilt : "div";

  return (
    <CardContent
      className={cn("rounded-lg border border-border shadow-sm", className)}
    >
      {children}
    </CardContent>
  );
};

export default Card;
