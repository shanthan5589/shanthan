import { blogPosts } from "@/content/posts";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentsWithAuth } from "./page.client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.slug === id);
  if (!post) notFound();
  const isBackpropagationSeries = id.startsWith("backpropagation-part-");
  const updatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(post.date));

  return (
    <div className={isBackpropagationSeries ? "series-page" : undefined}>
      {isBackpropagationSeries ? <BackpropagationSeriesNav currentSlug={id} /> : null}
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
    </div>
  );
}

const backpropagationParts = [
  { slug: "backpropagation-part-1", label: "Part 1" },
  { slug: "backpropagation-part-2", label: "Part 2" },
  { slug: "backpropagation-part-3", label: "Part 3" },
] as const;

function BackpropagationSeriesNav({ currentSlug }: { currentSlug: string }) {
  const links = backpropagationParts.map((part) => (
    <li key={part.slug}>
      <Link
        href={`/blog/${part.slug}`}
        aria-current={part.slug === currentSlug ? "page" : undefined}
      >
        {part.label}
      </Link>
    </li>
  ));

  return (
    <>
      <aside className="series-nav-desktop" aria-label="Backpropagation article parts">
        <p>Backpropagation</p>
        <ol>{links}</ol>
      </aside>
      <details className="series-nav-mobile">
        <summary>Parts</summary>
        <nav aria-label="Backpropagation article parts">
          <p>Backpropagation</p>
          <ol>{links}</ol>
        </nav>
      </details>
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
