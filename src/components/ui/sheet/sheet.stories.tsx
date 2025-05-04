import React, { useState } from "react";
import { Sheet, SheetContent } from "./sheet";
import Button from "../button";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
};

export default meta;

export const Basic = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <h2>Sheet Content</h2>
          <p>This is a basic sheet dialog.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </SheetContent>
      </Sheet>
    </>
  );
};
