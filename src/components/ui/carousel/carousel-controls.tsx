import React from "react";
import { CarouselPrevious, CarouselNext } from "./carousel";

export function CarouselControls({ className }: { className?: string }) {
  return (
    <>
      <div className="hidden md:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
      <div
        className={`flex items-center justify-center gap-6 mt-10 md:hidden ${
          className ?? ""
        }`}
      >
        <CarouselPrevious className="static" />
        <CarouselNext className="static" />
      </div>
    </>
  );
}
