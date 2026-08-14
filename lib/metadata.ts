import type { Metadata } from "next/types";

export const baseUrl = "https://shanthan.dev";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      type: "website",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl,
      siteName: "Shanthan",
      ...override.openGraph,
    },
    twitter: {
      card: "summary",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      ...override.twitter,
    },
    metadataBase: new URL(baseUrl),
  };
}
