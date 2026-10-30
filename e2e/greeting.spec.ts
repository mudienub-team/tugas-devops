import { test, expect } from "@playwright/test";

test("greeting app e2e flow", async ({ page }) => {
  await page.goto("/");

  // Check initial state
  await expect(page.locator("h2")).toContainText("Greeting App");
  await expect(page.locator("h1")).toContainText("Hello! Please enter a name.");

  // Fill in name and submit
  await page.fill('input[name="name"]', "Alice");
  await page.click('button[type="submit"]');

  // Verify greeting message updates
  await expect(page.locator("h1")).toContainText("hello Alice");

  // Fill in name and submit
  await page.fill('input[name="name"]', "Budi");
  await page.click('button[type="submit"]');

  // Verify greeting message updates
  await expect(page.locator("h1")).toContainText("hello Budi");

  // Fill in name and submit
  await page.fill('input[name="name"]', " ");
  await page.click('button[type="submit"]');

  // Verify greeting message updates
  await expect(page.locator("h1")).toContainText("Hello! Please enter a name.");
});
