"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, JSX, useEffect, useState } from "react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/containers/SessionProvider";

type ProviderId = "gemini" | "claude" | "chatgpt";

type FormState = Record<ProviderId, string>;

type Provider = {
  id: ProviderId;
  name: string;
  logo: JSX.Element;
  placeholder: string;
};

const PROVIDERS: Array<Provider> = [
  {
    id: "gemini",
    name: "Gemini",
    logo: (
      <Image src="/llm-icons/gemini.png" alt="Gemini" width={32} height={32} />
    ),
    placeholder: "Enter your Gemini API key",
  },
  {
    id: "claude",
    name: "Claude",
    logo: (
      <Image src="/llm-icons/claude.png" alt="Claude" width={32} height={32} />
    ),
    placeholder: "Enter your Claude API key",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: (
      <Image
        src="/llm-icons/chatgpt.png"
        alt="ChatGPT"
        width={32}
        height={32}
        className="invert"
      />
    ),
    placeholder: "Enter your ChatGPT API key",
  },
];

const SettingsPage = () => {
  const [form, setForm] = useState<FormState>({
    gemini: "",
    claude: "",
    chatgpt: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { user, loading: userLoading } = useSession();

  useEffect(() => {
    if (!user || userLoading) return;

    setLoading(true);

    const fetchKeys = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_api_keys")
        .select("gemini_api_key, claude_api_key, chatgpt_api_key")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        setError("Failed to load API keys.");
      } else if (data) {
        setForm({
          gemini: data.gemini_api_key || "",
          claude: data.claude_api_key || "",
          chatgpt: data.chatgpt_api_key || "",
        });
      }

      setLoading(false);
    };

    fetchKeys();
  }, [user, userLoading]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (!PROVIDERS.map((provider) => provider.id).includes(name as ProviderId))
      return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user) return;

    setSaving(true);
    setSuccess("");
    setError("");

    const formatApiKey = (apiKey: string) => apiKey.trim().replace(/\s+/g, "");

    const supabase = createClient();
    const { error } = await supabase.from("user_api_keys").upsert(
      {
        user_id: user.id,
        gemini_api_key: formatApiKey(form.gemini),
        claude_api_key: formatApiKey(form.claude),
        chatgpt_api_key: formatApiKey(form.chatgpt),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      setError("Failed to save API keys.");
    } else {
      setSuccess("API keys saved successfully.");
    }

    setSaving(false);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-8 text-white">
        Model Provider Settings
      </h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="flex items-center gap-4 bg-[#18181b] border border-[#232329] rounded-lg p-6 shadow-md"
          >
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-[#232329] rounded-lg mr-4">
              {provider.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-white">
                  {provider.name}
                </span>
              </div>
              <Input
                id={provider.id}
                name={provider.id}
                type="text"
                placeholder={provider.placeholder}
                autoComplete="off"
                value={form[provider.id]}
                onChange={handleChange}
                disabled={loading || saving}
              />
            </div>
          </div>
        ))}
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={loading || saving || userLoading}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {success && (
          <div className="text-green-500 text-center mt-2">{success}</div>
        )}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default SettingsPage;
