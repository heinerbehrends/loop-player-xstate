import { test, expect } from "@playwright/test";

test("toggle play button has correct name and aria attributes and works", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  const playButton = page.getByRole("button", { name: /Play/ });
  await expect(playButton).toBeVisible();
  await expect(playButton).toBeEnabled();
  await expect(playButton).toHaveAttribute("aria-label", "Play audio");
  // Click the play button
  await playButton.click();
  const pauseButton = page.getByRole("button", { name: /Pause/ });
  await expect(pauseButton).toBeVisible();
  await expect(pauseButton).toBeEnabled();
  await expect(pauseButton).toHaveAttribute("aria-label", "Pause audio");
  const isPlaying = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio && !audio.paused;
  });
  await expect(isPlaying).toBe(true);

  // Click the pause button
  await pauseButton.click();
  await expect(playButton).toBeVisible();
  await expect(playButton).toBeEnabled();
  await expect(playButton).toHaveAttribute("aria-label", "Play audio");
  const isPaused = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio && audio.paused;
  });
  await expect(isPaused).toBe(true);
});

test("The play button receives focus and can be used with keyboard", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");

  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const audio = document.querySelector("audio");
      if (audio) {
        audio.addEventListener("canplaythrough", () => resolve(), {
          once: true,
        });
      }
    });
  });
  await page.evaluate(() => {
    const playButton = document.querySelector(
      'button[aria-label="Play audio"]'
    );
    if (playButton instanceof HTMLElement) {
      playButton.focus();
    }
  });
  const playButton = page.getByRole("button", { name: /Play/ });
  await expect(playButton).toBeFocused();
  await page.keyboard.press("Enter");
  const pauseButton = page.getByRole("button", { name: /Pause/ });
  await expect(pauseButton).toBeFocused();
  await page.keyboard.press("Space");
  await expect(playButton).toBeFocused();
});
