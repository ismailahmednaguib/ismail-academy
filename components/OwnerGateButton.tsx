"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export default function OwnerGateButton({ settings, className = "owner-button" }: { settings: Settings; className?: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const check = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        setAllowed(false);
        return;
      }
      const { data: owner } = await client.rpc("is_site_owner");
      if (owner === true) {
        setAllowed(true);
        return;
      }
      const { data: admin } = await client.rpc("is_site_admin");
      setAllowed(admin === true);
    };
    const listener = () => { void check(); };
    window.addEventListener("academy-auth-change", listener);
    void check();
    return () => window.removeEventListener("academy-auth-change", listener);
  }, []);

  if (!allowed) return null;
  return <Link className={className} href="/?admin=1">{settings.ownerPanelLabel}</Link>;
}
