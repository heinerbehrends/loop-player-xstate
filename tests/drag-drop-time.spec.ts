import { test, expect } from "@playwright/test";
import { waitForAudio, getTimelineState, getAudioState } from "./test-utils";

const PRECISION = 0.25;

test("drag timeline button to seek when paused", async ({ page }) => {
  await page.goto("/");
  await waitForAudio(page);

  const dragButton = await page.getByLabel("Drag to seek");

  // Get the timeline width and audio duration
  const { timelineWidth, duration } = await getTimelineState(page);

  // Click anywhere on the button and drag
  await dragButton.hover();
  await page.mouse.down();

  // Move halfway across the timeline
  const { timelineLeft } = await getTimelineState(page);
  await page.mouse.move(timelineLeft + timelineWidth / 2, 0);
  await page.mouse.up();

  // Verify the audio time was updated
  const { currentTime } = await getAudioState(page);

  // Should be at approximately half duration
  expect(currentTime).toBeCloseTo(duration / 2, PRECISION);
});

test("drag timeline button to seek while playing", async ({ page }) => {
  await page.goto("/");
  await waitForAudio(page);

  // Start playing
  await page.getByRole("button", { name: "Play audio" }).click();

  // Get the timeline state
  const { timelineWidth, duration, timelineLeft, currentTime } =
    await getTimelineState(page);

  // Calculate where the button should be and move there
  const currentOffset = (currentTime / duration) * timelineWidth;
  const buttonX = timelineLeft + currentOffset;
  const buttonY = await page.evaluate(() => {
    const button = document.querySelector("[aria-label='Drag to seek']");
    return button?.getBoundingClientRect().top ?? 0;
  });

  // Move to button position and start drag
  await page.mouse.move(buttonX, buttonY);
  await page.mouse.down();

  // Verify the audio time was updated
  const { currentTime: currentTimeUpdated } = await getAudioState(page);

  // Should be at approximately current time
  expect(currentTimeUpdated).toBeCloseTo(currentTime, PRECISION);

  // Verify audio is still playing
  const { isPlaying } = await getAudioState(page);
  expect(isPlaying).toBe(true);
});

test("drag button cannot move beyond timeline bounds", async ({ page }) => {
  await page.goto("/");
  await waitForAudio(page);

  // Get the timeline dimensions
  const { timelineLeft, timelineWidth } = await page.evaluate(() => {
    const timeline = document.querySelector("[data-testid='timeline']");
    const rect = timeline?.getBoundingClientRect();
    return {
      timelineLeft: rect?.left ?? 0,
      timelineWidth: rect?.width ?? 0,
    };
  });

  const dragButton = await page.getByLabel("Drag to seek");
  await dragButton.hover();
  await page.mouse.down();

  // Try to drag before the start of timeline
  await page.mouse.move(timelineLeft - 100, 0);

  // Get button position, should be at start
  let buttonLeft = await page.evaluate(() => {
    const button = document.querySelector("[aria-label='Drag to seek']");
    return button?.getBoundingClientRect().left ?? 0;
  });

  // Button should be at start of timeline (minus its offset)
  expect(buttonLeft).toBeCloseTo(timelineLeft - 12, 1);

  // Try to drag past end of timeline
  await page.mouse.move(timelineLeft + timelineWidth + 100, 0);

  // Get button position, should be at end
  buttonLeft = await page.evaluate(() => {
    const button = document.querySelector("[aria-label='Drag to seek']");
    return button?.getBoundingClientRect().left ?? 0;
  });

  // Button should be at end of timeline (minus its offset)
  expect(buttonLeft).toBeCloseTo(timelineLeft + timelineWidth - 12, 1);

  await page.mouse.up();

  // Verify audio times
  const { currentTime, duration } = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return {
      currentTime: audio?.currentTime ?? 0,
      duration: audio?.duration ?? 0,
    };
  });

  // Should be at end of timeline
  expect(currentTime).toBeCloseTo(duration, PRECISION);
});
