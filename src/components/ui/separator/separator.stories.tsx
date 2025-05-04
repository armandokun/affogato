import React from "react";
import Separator from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
};

export default meta;

export const Horizontal = () => (
  <div>
    <div>Above</div>
    <Separator />
    <div>Below</div>
  </div>
);

export const Vertical = () => (
  <div style={{ display: "flex", alignItems: "center", height: 40 }}>
    <span>Left</span>
    <Separator orientation="vertical" style={{ height: 40, margin: "0 8px" }} />
    <span>Right</span>
  </div>
);
