import { test, expect } from "@playwright/test";

test.describe("form", () => {
  test("contact form properly filled", async ({ page }) => {
    await page.goto("http://localhost:3033/experts-corporate-finance/");
    await page.locator('input[name="nom"]').click();
    await page.locator('input[name="nom"]').fill("CHANGARNIER");
    await page.locator('input[name="nom"]').press("Tab");
    await page.locator('input[name="prenom"]').fill("Stéphane");
    await page.getByRole("radio", { name: "Non" }).check();
    await page.locator('[id="m"]').check();
    await page.locator('input[name="societe"]').click();
    await page.locator('input[name="societe"]').fill("Pommeclic");
    await page.locator('input[name="societe"]').press("Tab");
    await page.locator('input[name="fonction"]').fill("Developeur");
    await page.locator('input[name="fonction"]').press("Meta+ArrowLeft");
    await page.locator('input[name="fonction"]').press("ArrowRight");
    await page.locator('input[name="fonction"]').press("ArrowRight");
    await page.locator('input[name="fonction"]').fill("Dévelopeur");
    await page.locator('input[name="fonction"]').press("Meta+ArrowRight");
    await page.locator('input[name="fonction"]').press("Tab");
    await page.locator('input[name="telephone"]').fill("0620202020");
    await page.locator('input[name="telephone"]').press("Tab");
    await page.locator('input[name="telephone"]').click();
    await page.locator('input[name="telephone"]').press("Tab");
    await page.locator('input[name="email"]').press("Tab");
    await page.locator('input[name="emailconfirmation"]').press("Shift+Tab");
    await page.locator('input[name="email"]').click();
    await page.locator('input[name="email"]').fill("stephane@pommeclic.com");
    await page.locator('input[name="email"]').press("Meta+Shift+ArrowLeft");
    await page.locator('input[name="email"]').press("Meta+c");
    await page.locator('input[name="email"]').press("ArrowRight");
    await page.locator('input[name="email"]').press("Tab");
    await page
      .locator('input[name="emailconfirmation"]')
      .fill("stephane@pommeclic.com");
    await page.locator('input[name="emailconfirmation"]').press("ArrowLeft");
    await page.locator('input[name="emailconfirmation"]').press("ArrowLeft");
    await page.locator('input[name="emailconfirmation"]').press("ArrowLeft");
    await page.locator('input[name="emailconfirmation"]').press("ArrowLeft");
    await page
      .locator('input[name="emailconfirmation"]')
      .fill("stephane@pommeclic.com");
    await page.locator('input[name="emailconfirmation"]').click();
    await page.locator('textarea[name="message"]').click();
    await page.locator('textarea[name="message"]').fill("Mon message");

    const requestPromise = page.waitForRequest(
      "http://localhost:8888/contact.php"
    );
    await page.getByRole("button", { name: "Valider" }).click();
    await requestPromise;

    await expect(page.getByTestId("completion-success")).toBeVisible();

    await new Promise(() => {});
  });
});
