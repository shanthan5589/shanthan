import { resolve } from "node:url";
import { MetadataRoute } from "next";
import { baseUrl } from "@/lib/metadata";
import { blogPosts } from "@/content/posts";

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
    {
      url: getUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...blogPosts.map<MetadataRoute.Sitemap[number]>((post) => ({
      url: getUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "weekly",
      priority: 0.5,
    })),
  ];
}
