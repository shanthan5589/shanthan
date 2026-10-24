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
    <article className="editorial-content listing-page">
      <h1 className="page-title">Blog</h1>
      <p className="page-intro">Articles and blog posts.</p>
      {posts.length > 0 ? (
        <div className="post-list">
          {posts.map((post) => (
            <Card key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <p className="muted">No posts yet.</p>
      )}
    </article>
  );
}
