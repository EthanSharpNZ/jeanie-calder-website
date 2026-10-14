import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

test("initial HTML contains content, metadata, indexability and working local assets", async ({
  request,
}) => {
  const response = await request.get("/");
  const html = await response.text();
  expect(html).toContain("<h1");
  expect(html).toContain("How to Lose Weight and Keep It Off");
  for (const tag of ["header", "nav", "main", "footer"]) expect(html).toContain(`<${tag}`);
  for (const tag of [
    'name="description"',
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'rel="canonical"',
  ])
    expect(html).toContain(tag);
  expect(html).not.toContain("noindex");
  expect(html).not.toMatch(/lovable|tanstack|__lovable/i);
  expect((await request.get("/not-a-real-page")).status()).toBe(404);
  expect((await request.get("/THIRD_PARTY_NOTICES.txt")).status()).toBe(200);
  expect(html).not.toContain("Design preview");
  expect(html).toContain('type="module"');
  for (const url of new Set(html.match(/\/assets\/[^\s"<>]+\.(?:webp|woff2|css|js)/g))) {
    expect((await request.get(url)).status(), url).toBe(200);
  }
  expect((await request.get("/images/jeanie-calder-book.jpg")).headers()["content-type"]).toContain(
    "image/jpeg",
  );
  expect(await (await request.get("/robots.txt")).text()).toContain("Allow: /");
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    "https://jeanie-calder-website.studionz.workers.dev/",
  );
  expect(await readFile("dist/_headers", "utf8")).not.toContain("noindex");
});

test("without JavaScript the complete page and contact link remain usable", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Programmes", exact: true })).toBeVisible();
  await expect(page.locator(".contact-email")).toHaveAttribute(
    "href",
    "mailto:calderjeanie@gmail.com",
  );
  await expect(page.locator(".contact-form")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await context.close();
});

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`hydration, navigation, contact and accessibility at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".book-cover")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Pre-order the book", exact: true }),
    ).toHaveAttribute(
      "href",
      "https://olympiapublishers.com/book/how-to-lose-weight-and-keep-it-off",
    );
    await expect(page.locator(".site-header")).toHaveCSS("position", "sticky");
    await expect
      .poll(() =>
        page
          .locator(".book-cover")
          .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
    if (width < 760) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
    }
    for (const [action, interest] of [
      ["Enquire about the course", "The ten-week course"],
      ["Ask about teacher training", "Teaching the ten-week course"],
      ["Discuss the programme", "Teacher of teachers programme"],
    ] as const) {
      await page.getByRole("link", { name: action, exact: true }).click();
      await expect(page.getByRole("combobox")).toHaveText(interest!);
    }
    await expect
      .poll(() => page.locator("#contact").evaluate((el) => el.getBoundingClientRect().top))
      .toBeGreaterThanOrEqual(92);
    await expect(page.locator("footer .motion-toggle, footer .credit-trigger")).toHaveCount(0);
    await page.getByRole("combobox").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Teacher of teachers programme", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Home");
    await expect(page.getByRole("option", { name: "General enquiry", exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("combobox")).toHaveText("General enquiry");
    await page.getByLabel("Name", { exact: true }).fill("Test Reader");
    await page.getByLabel("Email", { exact: true }).fill("reader@example.com");
    await page.getByLabel("Message", { exact: true }).fill("Please send book information.");
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error("denied")) },
      }),
    );
    await page.getByRole("button", { name: "Copy message" }).click();
    await expect(page.getByLabel("Your message to copy")).toContainText(
      "Please send book information.",
    );
    await expect(page.getByRole("button", { name: "Image credit" })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".hero-butterfly-canvas")).toHaveAttribute("data-phase", "idle", {
      timeout: 20000,
    });
    const headerBottom = await page
      .locator(".site-header")
      .evaluate((el) => el.getBoundingClientRect().bottom);
    expect(
      Number(await page.locator(".hero-butterfly-canvas").getAttribute("data-top")),
    ).toBeGreaterThan(headerBottom);
    await page.screenshot({ path: `artifacts/site-${width}.png`, fullPage: true });
  });
}

test("butterfly settles without a pause control and respects reduced motion", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator(".hero-butterfly-canvas");
  await expect(canvas).toHaveAttribute("data-phase", "idle", { timeout: 20000 });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-running", "false");
  await page.locator("#book").scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-phase", "idle");
  await expect(page.getByRole("button", { name: "Pause animation" })).toHaveCount(0);
  await page.locator("#book").scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-running", "false", { timeout: 6000 });
  await page.reload();
  await expect(canvas).toHaveAttribute("data-phase", "idle", { timeout: 15000 });
  await expect(canvas).toHaveAttribute("data-running", "false", { timeout: 6000 });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.locator("#book").scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-running", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const sprites: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("butterfly-atlas")) sprites.push(request.url());
  });
  await page.reload();
  await expect(canvas).toHaveAttribute("data-phase", "idle", { timeout: 15000 });
  await expect(canvas).toHaveAttribute("data-running", "false");
  expect(sprites).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(canvas).toHaveAttribute("data-running", "true", { timeout: 15000 });
  await expect(canvas).toHaveAttribute("data-phase", "idle");
});
