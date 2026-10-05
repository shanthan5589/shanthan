"use client";

import dynamic from "next/dynamic";
import { type HTMLAttributes, useEffect, useState } from "react";

export function Date({ value, ...props }: { value: string } & HTMLAttributes<HTMLSpanElement>) {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new globalThis.Date(value).toLocaleDateString(undefined, { dateStyle: "full" }));
  }, [value]);

  return <span {...props}>{date}</span>;
}

export const CommentsWithAuth = dynamic(() =>
  import("./comment").then((res) => res.CommentsWithAuth),
);
