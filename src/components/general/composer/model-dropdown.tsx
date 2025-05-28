import React from "react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import {
  LanguageModelCode,
  thinkingModelDropdownOptions,
} from "@/lib/ai/providers";
import { setCookie } from "@/lib/utils";
import { SELECTED_MODEL_COOKIE } from "@/constants/chat";

type ModelOption = {
  value: string;
  label: string;
  logo: string;
  badge?: string;
  description?: string;
};

type Props = {
  selectedModelCode: LanguageModelCode;
  setSelectedModel: (value: LanguageModelCode) => void;
  modelDropdownOptions: Array<ModelOption>;
};

const ModelDropdown = ({
  selectedModelCode,
  setSelectedModel,
  modelDropdownOptions,
}: Props) => {
  const selectedModel =
    modelDropdownOptions.find((opt) => opt.value === selectedModelCode) ||
    thinkingModelDropdownOptions.find((opt) => opt.value === selectedModelCode);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <button
            type="button"
            className={
              "bg-white/5 backdrop-blur-xl text-white text-sm rounded-full px-4 py-2 outline-none flex items-center gap-2 cursor-pointer transition-opacity"
            }
          >
            {selectedModel && (
              <Image
                src={selectedModel.logo}
                alt="Model logo"
                width={20}
                height={20}
                className="inline-block"
              />
            )}
            {selectedModel?.label || "Select Model"}
            <span className="ml-2">&#9662;</span>
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className="w-72"
        sideOffset={10}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div>
              <div className="font-semibold">Chat Models</div>
              <div className="text-xs text-muted-foreground">
                General conversation and Q&A
              </div>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-72"
            style={{
              maxHeight: "calc(100vh - 40px)",
              marginBottom: 20,
              overflowY: "auto",
            }}
          >
            {modelDropdownOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => {
                  setSelectedModel(option.value as LanguageModelCode);
                  setCookie(SELECTED_MODEL_COOKIE, option.value);
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
                  <div className="font-semibold flex items-center gap-2">
                    {option.label}
                    {option.badge && (
                      <span className="text-xs bg-gradient-to-r from-blue-500 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div>
              <div className="font-semibold">Reasoning Models</div>
              <div className="text-xs text-muted-foreground">
                Advanced logic, analysis, and problem solving
              </div>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-72"
            style={{
              maxHeight: "calc(100vh - 40px)",
              marginBottom: 20,
              overflowY: "auto",
            }}
          >
            {thinkingModelDropdownOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => {
                  setSelectedModel(option.value as LanguageModelCode);
                  setCookie(SELECTED_MODEL_COOKIE, option.value);
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
                  <div className="font-semibold flex items-center gap-2">
                    {option.label}
                    {option.badge && (
                      <span className="text-xs bg-gradient-to-r from-blue-500 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelDropdown;
