import React from "react";
import Skeleton from "./skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
};

export default meta;

export const Basic = () => <Skeleton />;

export const CustomSize = () => <Skeleton style={{ width: 200, height: 32 }} />;
