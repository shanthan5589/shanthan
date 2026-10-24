import Link from "next/link";

export function Card({
  slug,
  title,
  date: rawDate,
  description,
}: {
  slug: string;
  title: string;
  description: string;
  date: string;
}) {
  const date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(rawDate));

  return (
    <Link
      href={`/blog/${slug}`}
      className="post-list-item"
    >
      <span className="post-meta">{date}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  );
}
