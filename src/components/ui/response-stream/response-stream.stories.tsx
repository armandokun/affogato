import React from "react";
import { ResponseStream } from "./response-stream";

const meta = {
  title: "UI/ResponseStream",
  component: ResponseStream,
};

export default meta;

export const Typewriter = () => (
  <ResponseStream textStream="This is a typewriter effect." mode="typewriter" />
);

export const Fade = () => (
  <ResponseStream textStream="This is a fade effect." mode="fade" />
);
