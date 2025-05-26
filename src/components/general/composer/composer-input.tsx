import { ChangeEvent, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Props = {
  input: string;
  setInput: (input: string) => void;
  onImagePaste?: (file: File) => void;
};

const ComposerInput = ({ input, setInput, onImagePaste }: Props) => {
  const [textareaHeight, setTextareaHeight] = useState(24);

  const maxRows = 10;
  const lineHeight = 24;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input.length > 0) return;

    setTextareaHeight(24);
  }, [input]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);

    if (textareaRef.current) {
      const maxHeight = lineHeight * maxRows;

      textareaRef.current.style.height = "auto";

      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);

      setTextareaHeight(newHeight);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const form = textareaRef.current?.closest("form");

      if (!form) return;

      form.requestSubmit();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!event.clipboardData) return;

    const items = event.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();

        if (file && typeof onImagePaste === "function") {
          event.preventDefault();
          onImagePaste(file);

          break;
        }
      }
    }
  };

  return (
    <motion.textarea
      ref={textareaRef}
      initial={false}
      animate={{ height: textareaHeight }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.3,
      }}
      value={input}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      rows={1}
      placeholder="How can I help you today?"
      className="flex-1 outline-none text-md text-white placeholder:text-muted-foreground resize-none w-full h-auto mb-2"
      autoFocus
      style={{
        minHeight: 24,
        maxHeight: 240,
        overflowY: textareaHeight < 240 ? "hidden" : "auto",
      }}
    />
  );
};

export default ComposerInput;
