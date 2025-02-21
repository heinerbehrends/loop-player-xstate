import { test, expect } from "@playwright/test";

test("progress indicator initial state", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const progressIndicator = page.getByRole("progressbar");
  await expect(progressIndicator).toBeEnabled();
  await expect(progressIndicator).toHaveAttribute(
    "aria-label",
    /Audio progress/
  );
  await expect(progressIndicator).toHaveAttribute("aria-valuemin", "0");
  await expect(progressIndicator).toHaveAttribute("aria-valuenow", "0");
});

test("progress indicator updates on audio playback", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const progressIndicator = page.getByRole("progressbar");
  await expect(progressIndicator).toBeEnabled();
  const playButton = page.getByRole("button", { name: /Play/ });
  await playButton.click();
  await page.waitForTimeout(1000);
  const pauseButton = page.getByRole("button", { name: /Pause/ });
  await pauseButton.click();
  const [currentTime, duration] = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return [audio?.currentTime, audio?.duration];
  });
  await expect(progressIndicator).toHaveAttribute(
    "aria-valuemax",
    (duration ?? "").toString()
  );
  const progressValue = await progressIndicator.getAttribute("aria-valuenow");
  const progressNumber = parseFloat(progressValue ?? "0");
  expect(Math.abs(progressNumber - (currentTime ?? 0))).toBeLessThan(0.1);
  // Get the width of the progress indicator element
  const [progressWidth, parentWidth] = await page.evaluate(() => {
    const progress = document.querySelector('[role="progressbar"]');
    const parent = progress?.parentElement;
    const progressWidth = progress?.getBoundingClientRect().width ?? 0;
    const parentWidth = parent?.getBoundingClientRect().width ?? 1; // Default to 1 to avoid division by zero
    return [progressWidth, parentWidth];
  });
  console.log(progressWidth, parentWidth);
  // Calculate the actual progress ratio
  const actualRatio = progressWidth / parentWidth;

  // Calculate expected progress ratio (currentTime/duration)
  const expectedRatio = (currentTime ?? 0) / (duration ?? 1);

  // The actual progress ratio should be approximately equal to the expected ratio
  expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.1);
});
