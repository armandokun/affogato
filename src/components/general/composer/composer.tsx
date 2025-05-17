import { FormEvent } from "react";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import Button from "@/components/ui/button";

import { setCookie } from "@/lib/utils";
import { LanguageModelCode, modelDropdownOptions } from "@/lib/ai/providers";

import Icons from "../icons";
import ComposerInput from "./composer-input";

const COOKIE_NAME = "affogato_selected_model";

type Props = {
  input: string;
  setInput: (input: string) => void;
  submitForm: (event: FormEvent<HTMLFormElement>) => void;
  hasMessages: boolean;
  selectedModelCode: LanguageModelCode;
  setSelectedModel: (modelCode: LanguageModelCode) => void;
  status: "ready" | "streaming" | "submitted" | "error";
  stop: () => void;
};

const Composer = ({
  input,
  setInput,
  submitForm,
  hasMessages,
  selectedModelCode,
  setSelectedModel,
  status,
  stop,
}: Props) => {
  return (
    <form
      onSubmit={submitForm}
      className="w-full max-w-2xl bg-background border border-border focus-within:border-muted-foreground rounded-lg shadow-lg p-4 absolute bottom-6 transition-colors"
    >
      {!hasMessages && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 items-center flex flex-row gap-2">
          <Icons.logo className="size-10 hover:animate-spin-once" />
          <p className="text-3xl font-semibold text-amber-50">Affogato</p>
        </div>
      )}
      <ComposerInput input={input} setInput={setInput} />
      <div className="flex items-center justify-between gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <button
                type="button"
                className={
                  "bg-muted text-white text-sm rounded-full px-4 py-2 outline-none flex items-center gap-2 cursor-pointer transition-opacity"
                }
              >
                {selectedModelCode && (
                  <Image
                    src={
                      modelDropdownOptions.find(
                        (opt) => opt.value === selectedModelCode
                      )?.logo || ""
                    }
                    alt="Model logo"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                )}
                {
                  modelDropdownOptions.find(
                    (opt) => opt.value === selectedModelCode
                  )?.label
                }
                <span className="ml-2">&#9662;</span>
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-72">
            {modelDropdownOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => {
                  setSelectedModel(option.value);
                  setCookie(COOKIE_NAME, option.value);
                }}
                className="flex items-center gap-4 cursor-pointer mb-1"
              >
                <Image
                  src={option.logo}
                  alt={`${option.label} logo`}
                  width={20}
                  height={20}
                  className="inline-block"
                />
                <div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
            type="button"
            tabIndex={-1}
          >
            <Paperclip className="size-5" />
          </Button>
          {status === "streaming" || status === "submitted" ? (
            <Button
              size="icon"
              className="rounded-full"
              type="button"
              onClick={stop}
            >
              <Square className="size-4" fill="black" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="rounded-full"
              type="submit"
              disabled={!input.trim()}
            >
              <ArrowUp className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Composer;
