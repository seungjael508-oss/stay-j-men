import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Stay J Men pilot", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Stay J Men — 남성 스타일 어드바이저<\/title>/i);
  assert.match(html, /사진 두 장이면/);
  assert.match(html, /STAY J/);
  assert.match(html, /aria-label="주요 메뉴"/);
  assert.match(html, /MY/);
  assert.match(html, /TODAY/);
  assert.match(html, /ASK/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("ships the male advisor metadata", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /남성 스타일 어드바이저/);
  assert.match(html, /나를 알고, 오늘을 결정하고/);
  assert.match(html, /lang="ko"/);
});
