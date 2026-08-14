import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";
import { createMetadata } from "@/lib/metadata";
import { Main } from "./layout.client";

const geist = Geist({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = createMetadata({
  title: {
    absolute: "Shanthan",
    template: "Shanthan | %s",
  },
  description: "My personal website.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geist.className,
          mono.variable,
          "bg-neutral-950 text-neutral-50 min-h-screen dark",
        )}
      >
        <Main>{children}</Main>
      </body>
    </html>
  );
}
