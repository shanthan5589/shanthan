import { blogPosts } from "@/content/posts";
import { createMetadata } from "@/lib/metadata";
import { Card } from "./card";

export const metadata = createMetadata({
  title: "Blog",
  description: "Articles and blog posts.",
});

export default function Page() {
  const posts = blogPosts.toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return (
    <main>
      <h1 className="font-semibold text-xl mb-2">Blog</h1>
      <p className="text-sm text-neutral-400 mb-4">Articles and blog posts.</p>
      {posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <Card key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">No posts yet.</p>
      )}
    </main>
  );
}
