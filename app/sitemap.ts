import { resolve } from "node:url";
import { MetadataRoute } from "next";
import { baseUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const getUrl = (v: string) => resolve(baseUrl, v);

  return [
    {
      url: getUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: getUrl("/projects"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
