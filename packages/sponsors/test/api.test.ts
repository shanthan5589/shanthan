import assert from "node:assert/strict";
import test from "node:test";
import { getSponsors, sponsorsApiUrl, type APISponsorItem } from "../src/api.ts";

const sponsors: APISponsorItem[] = [
  {
    __typename: "Organization",
    login: "example",
    avatarUrl: "https://example.com/avatar.png",
    websiteUrl: "https://example.com",
    name: "Example",
    tier: {
      monthlyPriceInDollars: 225,
    },
    tierName: "Golden Sponsor",
    isActive: true,
    isOneTimePayment: false,
  },
];

test("fetches sponsors from the public API", async (context) => {
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    assert.equal(input, sponsorsApiUrl);
    return Response.json(sponsors);
  });

  assert.deepEqual(await getSponsors(), sponsors);
});

test("throws when the public API responds with an error", async (context) => {
  context.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503, statusText: "Unavailable" }),
  );

  await assert.rejects(getSponsors(), /503 Unavailable/);
});
