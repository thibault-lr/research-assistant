import { test, expect } from "@playwright/test";

test.describe("Chat Page", () => {
  test("Simple chat flow", async ({ page }) => {
    const mockResponse =
      "DNA is the molecule that carries genetic instructions in all living organisms.";

    await page.route("**/api/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: mockResponse,
        headers: {
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    });

    await page.goto("/");

    const input = page.getByPlaceholder(
      "What would you like to know about biomedical research"
    );
    const submitButton = page.getByRole("button", { name: "Send" });

    await expect(
      page.getByText(
        "Ask questions about biomedical research and get instant answers"
      )
    ).toBeVisible();

    const firstQuestion = "What is DNA?";
    await input.fill(firstQuestion);
    await submitButton.click();

    await expect(input).toHaveValue("");
    await expect(page.getByText("What is DNA?")).toBeVisible();
    await expect(
      page.getByText(
        "DNA is the molecule that carries genetic instructions in all living organisms."
      )
    ).toBeVisible();
  });
});
