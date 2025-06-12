"use client";

import { useEffect } from "react";

const PixelTracker = () => {
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

    if (!pixelId) return;

    import("react-facebook-pixel").then((ReactPixel) => {
      ReactPixel.default.init(pixelId);
      ReactPixel.default.pageView();
    });
  }, []);

  return null;
};

export default PixelTracker;
