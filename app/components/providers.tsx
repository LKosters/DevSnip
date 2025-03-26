"use client";

import { ReactNode, useEffect } from "react";
import posthog from "posthog-js";

interface ProvidersProps {
  children: ReactNode;
}

export function PostHogProvider({ children }: ProvidersProps) {
  useEffect(() => {
    posthog.init("phc_dn8kh6pSsbWB6QTryqb5KCflzqZsKrTGiNMdUIzvnAB", {
      api_host: "https://eu.i.posthog.com",
      person_profiles: "always",
    });
  }, []);

  return <>{children}</>;
}
