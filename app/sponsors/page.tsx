import type { ReactNode } from "react";
import Image from "next/image";
import { getSponsors, type Sponsor } from "@/lib/get-sponsors";
import { hidden, organizationAsUserSponsors, tiers } from "./data";
import { HeartIcon } from "lucide-react";
import SponsorsBG from "@/public/sponsor-bg.png";
import Link from "next/link";

export const revalidate = 3600;

interface SponsorItem extends Sponsor {
  logo?: ReactNode;
  tierInfo?: (typeof tiers)[number];
  href: string;
}

function mapSponsors(result: Sponsor[]): SponsorItem[] {
  return result.flatMap((v) => {
    if (hidden.has(v.login)) return [];
    const tierInfo = tiers.find((tier) => v.tier.monthlyPriceInDollars >= tier.min);
    const orgs = organizationAsUserSponsors.filter((entity) => entity.asUser === v.login);

    if (orgs.length > 0) {
      return orgs.map((org) => ({
        ...v,
        href: org.websiteUrl,
        tierInfo,
        __typename: "Organization",
        login: org.login,
        name: org.name,
        websiteUrl: org.websiteUrl,
        logo: org.logo,
      }));
    }

    let href: string;
    if (v.websiteUrl) {
      href = v.websiteUrl.startsWith("http") ? v.websiteUrl : `https://${v.websiteUrl}`;
    } else {
      href = `https://github.com/${v.login}`;
    }
    return { ...v, href, tierInfo };
  });
}

export default async function Page() {
  const all = mapSponsors(await getSponsors());
  const pastSponsors: SponsorItem[] = [];
  const grouped = new Map<(typeof tiers)[number]["name"] | "none", SponsorItem[]>();
  for (const tier of tiers) {
    grouped.set(tier.name, []);
  }
  grouped.set("none", []);
  for (const sponsor of all) {
    if (!sponsor.isActive) {
      pastSponsors.push(sponsor);
      continue;
    }

    const name = sponsor.tierInfo?.name ?? "none";
    grouped.get(name)!.push(sponsor);
  }

  return (
    <main className="flex flex-col w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col items-start relative z-2 p-4 pt-16 rounded-lg overflow-hidden lg:p-8 lg:aspect-[16/7]">
        <Image
          src={SponsorsBG}
          alt=""
          className="absolute inset-0 size-full -z-1 object-cover pointer-events-none select-none"
          priority
        />
        <h1 className="text-2xl font-medium bg-clip-text text-transparent bg-linear-to-b from-cyan-50 to-cyan-100/80 mt-auto lg:text-4xl">
          Support Open Source
        </h1>
        <p className="mt-6 text-sm text-cyan-100/80 max-w-[800px] lg:text-base">
          Support the development work of Fumadocs, Fumapress, Tegami, FumaDB, and other open source{" "}
          <Link
            href="/projects"
            className="transition-colors underline underline-offset-4 hover:text-cyan-50"
          >
            projects
          </Link>{" "}
          by Fuma Nama.
        </p>
        <a
          href="https://github.com/sponsors/fuma-nama"
          rel="noreferrer noopener"
          target="_blank"
          className="inline-flex items-center text-sm font-medium font-mono bg-blue-950 text-cyan-100 px-4 py-2 group mt-6 mb-auto"
        >
          Become a Sponsor
          <span className="w-0 transition-[width] overflow-hidden group-hover:w-6">
            <HeartIcon className="text-pink-200 ms-auto fill-current size-4 dark:text-red-400" />
          </span>
        </a>
        <div className="mt-12 w-full text-start font-mono text-xs text-cyan-100/80">
          <span className="absolute">{`>`}</span>
          <p className="ps-4">
            I love to build useful, high-quality tools for developers.
            <br />
            I will be very grateful if you are interested to support my work :D
          </p>
        </div>
      </div>

      {Array.from(grouped.entries()).map(([name, group]) => {
        if (group.length === 0) return;
        const orgs = group.filter((item) => item.__typename === "Organization");
        const users = group.filter((item) => item.__typename === "User");
        return (
          <Section
            key={name}
            title={
              {
                "Platinum Sponsor": <span className="text-purple-400">Platinum Sponsors</span>,
                "Golden Sponsor": <span className="text-amber-400">Golden Sponsors</span>,
                "Silver Sponsor": <span>Silver Sponsors</span>,
                none: <span className="text-neutral-400">Sponsors</span>,
              }[name]
            }
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {orgs.map((sponsor) => (
                <SponsorItem key={sponsor.name} {...sponsor} />
              ))}
            </div>
            <div className="border-t border-neutral-600 border-dashed mt-4 pt-6 w-full flex flex-wrap gap-x-8 gap-y-4 empty:hidden">
              {users.map((sponsor) => (
                <SponsorItem key={sponsor.name} {...sponsor} />
              ))}
            </div>
          </Section>
        );
      })}
      <Section title="Open Source Program">
        <div className="flex">
          <a href="https://vercel.com" rel="noreferrer noopener">
            <svg
              aria-label="Vercel logotype"
              role="img"
              viewBox="0 0 283 64"
              className="w-32 h-auto"
            >
              <path
                d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </Section>
      {pastSponsors.length > 0 && (
        <Section title="Past Sponsors">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {pastSponsors.map((sponsor) => (
              <a
                key={sponsor.login}
                href={sponsor.href}
                rel="noreferrer noopener"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl text-xs text-start transition-colors text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
              >
                {sponsor.logo ?? (
                  <Image
                    alt="avatar"
                    src={sponsor.avatarUrl}
                    unoptimized
                    width="30"
                    height="30"
                    className="rounded-lg opacity-70"
                  />
                )}
                <p>
                  <span className="font-medium">{sponsor.name}</span>
                  <br />
                  <code>${sponsor.tier.monthlyPriceInDollars}</code>{" "}
                  {sponsor.isOneTimePayment ? "one-time" : "monthly"}
                </p>
              </a>
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}

function SponsorItem(sponsor: SponsorItem) {
  if (sponsor.__typename === "User") {
    return (
      <a
        href={sponsor.href}
        rel="noreferrer noopener"
        target="_blank"
        className="inline-flex items-center gap-2 rounded-xl text-xs font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        <Image
          alt="avatar"
          src={sponsor.avatarUrl!}
          unoptimized
          width="30"
          height="30"
          className="rounded-lg"
        />
        {sponsor.name}
      </a>
    );
  }

  return (
    <a
      href={sponsor.href}
      rel="noreferrer noopener"
      target="_blank"
      className="inline-flex h-14 items-center gap-2.5 font-medium text-xl"
    >
      {sponsor.logo ?? (
        <>
          <Image
            alt="avatar"
            src={sponsor.avatarUrl}
            unoptimized
            width="38"
            height="38"
            className="rounded-lg"
          />
          <p>{sponsor.name}</p>
        </>
      )}
    </a>
  );
}

function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-12 bg-neutral-900 border border-neutral-400/10 rounded-lg p-4 lg:p-8">
      <h2 className="font-mono font-medium text-xs mb-7">{title}</h2>
      {children}
    </div>
  );
}
