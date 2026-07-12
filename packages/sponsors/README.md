# `@fumari/sponsors`

Sponsor API client and the sponsor marquee used across Fuma Nama's open-source projects.

```tsx
import { SponsorsMarquee } from "@fumari/sponsors";
import "@fumari/sponsors/style.css";

export default function Footer() {
  return <SponsorsMarquee />;
}
```

The component fetches the public sponsor API with a one-hour revalidation by default.

Use the API entry to fetch the public sponsor feed:

```ts
import { getSponsors } from "@fumari/sponsors/api";

const sponsors = await getSponsors();
```
