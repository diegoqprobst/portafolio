import assert from "node:assert/strict";
import test from "node:test";

import { HACKATHONS } from "./hackathons.ts";

test("hackathons list both events with bilingual copy and external links", () => {
  assert.equal(HACKATHONS.length, 2);

  for (const hackathon of HACKATHONS) {
    assert.match(hackathon.year, /^20\d{2}$/);
    assert.ok(hackathon.summary.en.length > 0);
    assert.ok(hackathon.summary.es.length > 0);
    assert.equal(hackathon.highlights.en.length, hackathon.highlights.es.length);
    assert.ok(hackathon.links.length > 0);
    for (const link of hackathon.links) {
      assert.ok(link.href.startsWith("https://"));
    }
  }
});
