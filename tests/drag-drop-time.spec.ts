import { test, expect } from "@playwright/test";
import { waitForAudio } from "./test-utils";

const PRECISION = 0.25;

test("drag timeline button to seek when paused", async ({ page }) => {
  await page.goto("/");
  await waitForAudio(page);

  const dragButton = page.getByLabel("Drag to seek");

  // Get the timeline width and audio duration
  const [timelineWidth, duration] = await page.evaluate(() => {
    const timeline = document.querySelector("[data-testid='timeline']");
    const audio = document.querySelector("audio");
    return [timeline?.getBoundingClientRect().width ?? 0, audio?.duration ?? 0];
  });

  // Click anywhere on the button and drag
  await dragButton.hover();
  await page.mouse.down();

  // Move halfway across the timeline
  const timelineLeft = await page.evaluate(() => {
    const timeline = document.querySelector("[data-testid='timeline']");
    return timeline?.getBoundingClientRect().left ?? 0;
  });
  await page.mouse.move(timelineLeft + timelineWidth / 2, 0);
  await page.mouse.up();

  // Verify the audio time was updated
  const currentTime = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio?.currentTime ?? 0;
  });

  // Should be at approximately half duration
  expect(currentTime).toBeCloseTo(duration / 2, PRECISION);
});

test("drag timeline button to seek while playing", async ({ page }) => {
  await page.goto("/");
  await waitForAudio(page);

  // Start playing
  await page.getByRole("button", { name: "Play audio" }).click();

  const dragButton = page.getByLabel("Drag to seek");

  // Get the timeline width and audio duration
  const [timelineWidth, duration] = await page.evaluate(() => {
    const timeline = document.querySelector("[data-testid='timeline']");
    const audio = document.querySelector("audio");
    return [timeline?.getBoundingClientRect().width ?? 0, audio?.duration ?? 0];
  });

  // Click anywhere on the button and drag
  await dragButton.hover();
  await page.mouse.down();

  // Move to 75% of the timeline
  const timelineLeft = await page.evaluate(() => {
    const timeline = document.querySelector("[data-testid='timeline']");
    return timeline?.getBoundingClientRect().left ?? 0;
  });
  await page.mouse.move(timelineLeft + timelineWidth * 0.75, 0);
  await page.mouse.up();

  // Verify the audio time was updated
  const currentTime = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio?.currentTime ?? 0;
  });

  // Should be at approximately 75% of duration
  expect(currentTime).toBeCloseTo(duration * 0.75, PRECISION);

  // Verify audio is still playing
  const isPlaying = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio && !audio.paused;
  });
  expect(isPlaying).toBe(true);
});
