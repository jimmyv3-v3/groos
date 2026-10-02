import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { GET } from "@/app/beheer/manifest.webmanifest/route";

describe("beheermanifest (spec 08 §4.12, AC-08-03)", () => {
  it("heeft scope /beheer, zodat start_url en het overzicht erbinnen vallen", async () => {
    const res = GET();
    assert.equal(res.headers.get("content-type"), "application/manifest+json");
    const m = (await res.json()) as Record<string, unknown>;
    assert.equal(m.start_url, "/beheer");
    assert.equal(m.scope, "/beheer");
    assert.equal(m.display, "standalone");
    assert.ok(String(m.start_url).startsWith(String(m.scope)));
  });
});
