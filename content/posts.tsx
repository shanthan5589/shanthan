import type { ReactNode } from "react";
import { backpropagationPart1 } from "./backpropagation-part-1";
import { backpropagationPart2 } from "./backpropagation-part-2";
import { backpropagationPart3 } from "./backpropagation-part-3";
import { mesoGPT } from "./mesogpt";
import { thereIsNoEngineerInMe } from "./there-is-no-engineer-in-me";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: ReactNode;
}

// Add your posts here. Dates use the YYYY-MM-DD format.


export const blogPosts: BlogPost[] = [
  {
    slug: "there-is-no-engineer-in-me",
    title: "There is no engineer in me",
    description: "Thoughts on engineering, AI, and purpose.",
    date: "2026-11-27",
    content: thereIsNoEngineerInMe,
  },
  {
    slug: "backpropagation-part-1",
    title: "Backpropagation in Neural Networks",
    description: "Part 1 of a series on backpropagation.",
    date: "2026-03-09",
    content: backpropagationPart1,
  },
  {
    slug: "backpropagation-part-2",
    title: "Backpropagation (Part-2)",
    description: "Part 2 of a series on backpropagation.",
    date: "2026-03-10",
    content: backpropagationPart2,
  },
  {
    slug: "backpropagation-part-3",
    title: "Backpropagation (Part-3)",
    description: "Part 3 of a series on backpropagation.",
    date: "2026-03-11",
    content: backpropagationPart3,
  },
  {
    slug: "mesogpt",
    title: "mesoGPT",
    description: "Building and training large language models from scratch.",
    date: "2026-09-21",
    content: mesoGPT,
  },
];
