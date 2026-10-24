import { blogPosts } from "@/content/posts";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentsWithAuth } from "./page.client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.slug === id);
  if (!post) notFound();
  const updatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(post.date));

  return (
    <>
      <article className="editorial-content blog-post">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-description">{post.description}</p>
        <div className="post-body">{post.content}</div>
      </article>
      <footer className="post-footer">
        <p className="last-updated">
          <span>Last Updated:</span>{" "}
          <span>{updatedAt}</span>
        </p>
        <Link
          href="/blog"
          className="back-link"
        >
          Back to blog
        </Link>
      </footer>
      <CommentsWithAuth page={id} />
    </>
  );
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.slug === id);
  if (!post) notFound();

  return createMetadata({
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      authors: "Shanthan",
      modifiedTime: new globalThis.Date(post.date).toISOString(),
    },
  });
}
