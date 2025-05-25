import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/containers/SessionProvider";

export type LibraryItem = {
  id: string;
  title: string;
  created_at: string;
};

export default function useLibraryItems() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSession();

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user) return;

      const supabase = createClient();

      const { data, error } = await supabase
        .from("chats")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .limit(15)
        .order("created_at", { ascending: false });

      if (!error && data) setItems(data);

      setLoading(false);
    };

    fetchLibrary();
  }, [user]);

  return { items, loading };
}
