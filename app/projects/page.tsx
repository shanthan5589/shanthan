import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects",
  description: "Machine learning, AI, and software projects built by Shanthan.",
});

const projects: ProjectProps[] = [

  {
    name: "mesoGPT",
    description:
      "Implemented a 97.7M-parameter decoder-only Transformer in PyTorch and pretrained it from scratch on 1.95B tokens"
      + " using a single NVIDIA L40S GPU for 20.8 hours with a training cost of $38.7, achieving a validation BPB of 1.1509.",
    href: "https://github.com/shanthan5589/mesoGPT",
  },
  {
    name: "microGPT",
    description:
      "Built a 10.8M-parameter character-level Transformer and trained the model on an NVIDIA T4 GPU with a 256-character"
      + " context window, achieving a validation loss of 1.786.",
    href: "https://github.com/shanthan5589/microGPT",
  },
  {
    name: "Mitosis Detector",
    description:
      "Built a two-stage pipeline combining YOLOv8 with an EfficientNet-B2 classifier trained on hard negatives to detect"
      +" mitotic figures in histopathology patches extracted from whole-slide images across varying staining protocols.",
    href: "https://github.com/shanthan5589/mitosis-detector",
  },
  {
    name: "Event Horizon",
    description:
      "A retrieval-augmented Q&A system that makes black-hole physics literature easier to explore through natural-language questions.",
    href: "https://huggingface.co/spaces/shanthan5589/event-horizon",
  },
  {
    name: "AI Fluency Test",
    description:
      "An LLM-powered platform that creates realistic work scenarios from a resume and evaluates practical AI tool-use strategy on a 0–100 rubric.",
    href: "https://ai-fluency-test.vercel.app/",
  },
  {
    name: "Edu",
    description:
      "An AI proficiency assessment platform that measures how effectively users apply AI tools across five practical domains.",
    href: "https://edu.castorai.in/",
  },
  {
    name: "Mind Archive",
    description:
      "An AI-assisted journaling app for capturing thoughts, revisiting entries, and discovering patterns and connections across ideas.",
    href: "https://archive.shanthan.dev",
  },
  {
    name: "Product Price Tracker",
    description:
      "A price-intelligence tool that tracks Indian e-commerce listings, sends price-drop alerts, and predicts future prices with an LSTM model.",
    href: "https://product-price-tracker-sjlo.onrender.com",
  },
  {
    name: "House Price Prediction",
    description:
      "An end-to-end Kaggle regression pipeline using feature-aware preprocessing and XGBoost, reaching the public leaderboard's top 300.",
    href: "https://github.com/shanthan5589/house-price-prediction",
  },
  {
    name: "Portfolio Website",
    description:
      "A fast, minimal personal website designed to present my profile, highlight current projects, and make it easy to connect.",
    href: "https://github.com/shanthan5589/shanthan5589.github.io",
  },
];

export default function Page() {
  return (
    <article className="flex flex-col gap-2">
      <h1 className="font-semibold text-xl">Projects</h1>
      <p className="text-sm text-neutral-400 mb-2">
        A selection of my work across machine learning, AI, and software development.
      </p>
      <div className="flex flex-col divide-y divide-neutral-800 mb-6">
        {projects.map((project) => (
          <Project key={project.href} {...project} />
        ))}
      </div>
    </article>
  );
}

interface ProjectProps {
  name: string;
  description: string;
  href: string;
}

function Project(project: ProjectProps) {
  return (
    <a
      href={project.href}
      className="group px-4 py-3 -mx-4 rounded-xl text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-neutral-200 hover:transition-none"
      target="_blank"
      rel="noreferrer noopener"
    >
      <p className="text-sm text-neutral-100 font-medium">{project.name}</p>
      <p className="text-sm">{project.description}</p>
    </a>
  );
}
