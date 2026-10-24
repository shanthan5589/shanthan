"use client";

import dynamic from "next/dynamic";

export const CommentsWithAuth = dynamic(() =>
  import("./comment").then((res) => res.CommentsWithAuth),
);
