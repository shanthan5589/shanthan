import { blogPosts } from "@/content/posts";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentsWithAuth, Date } from "./page.client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.slug === id);
  if (!post) notFound();

  return (
    <>
      <article className="text-neutral-300">
        <h1 className="text-xl font-semibold">{post.title}</h1>
        <p className="mt-2 text-sm text-neutral-400">{post.description}</p>
        <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-300">{post.content}</div>
      </article>
      <p className="mt-8 text-sm">
        <span className="font-medium mr-1">Last Updated:</span>
        <Date className="text-neutral-400" value={post.date} />
      </p>
      <footer className="flex flex-row items-end justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-4 mt-4">
        <div>
          <p className="text-sm font-medium">Shanthan</p>
          <p className="text-sm text-neutral-400">21, CS (AIML) undergrad.</p>
        </div>
        <Link
          href="/blog"
          className="text-xs rounded-md px-2 py-1.5 border border-neutral-700 bg-neutral-800 font-medium transition-colors hover:bg-neutral-700"
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
