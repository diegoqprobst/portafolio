import assert from "node:assert/strict";
import test from "node:test";

import { FEATURED_WORK } from "./featured-work.ts";

test("featured work surfaces at least four current, client-ready case studies", () => {
  assert.ok(FEATURED_WORK.length >= 4);

  for (const project of FEATURED_WORK) {
    assert.match(project.year, /^20\d{2}$/);
    assert.ok(project.title.length > 0);
    assert.ok(project.service.en.length > 0);
    assert.ok(project.service.es.length > 0);
    assert.ok(project.outcome.en.length > 0);
    assert.ok(project.outcome.es.length > 0);
    assert.ok(project.href.startsWith("/"));
  }
});

test("featured work links to both detailed case studies and finished documents", () => {
  assert.ok(FEATURED_WORK.some((project) => project.kind === "case-study"));
  assert.ok(FEATURED_WORK.some((project) => project.kind === "document"));
});
