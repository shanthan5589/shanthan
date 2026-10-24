import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { createMetadata } from "@/lib/metadata";
import { Main } from "./layout.client";

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
      <body>
        <Main>{children}</Main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
