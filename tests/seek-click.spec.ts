import { test, expect, Page } from "@playwright/test";
import { waitForAudio } from "./test-utils";

const CLICK_OFFSET = 100;
const PRECISION = 0.25;

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:5173/");
  await waitForAudio(page);
});

test.afterAll(async () => {
  await page.close();
});

test("jumps to correct position when paused", async () => {
  await page.getByTestId("timeline").click({
    position: { x: CLICK_OFFSET, y: 0 },
  });
  const [timelineWidth, duration] = await page.evaluate(getTimelineData);
  const progress = CLICK_OFFSET / timelineWidth;
  const expectedTime = duration * progress;
  const currentTime = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio?.currentTime;
  });
  expect(currentTime).toBeCloseTo(expectedTime, PRECISION);
});

test("jumps to correct position when playing", async () => {
  await page.getByRole("button", { name: "Play" }).click();
  await page.getByTestId("timeline").click({
    position: { x: CLICK_OFFSET, y: 0 },
  });
  await page.getByRole("button", { name: "Pause" }).click();
  const [timelineWidth, duration] = await page.evaluate(getTimelineData);
  const progress = CLICK_OFFSET / timelineWidth;
  const expectedTime = duration * progress;
  const currentTime = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio?.currentTime;
  });
  expect(currentTime).toBeCloseTo(expectedTime, PRECISION);
});

function getTimelineData() {
  const timeline = document.querySelector("[data-testid='timeline']");
  const duration = document.querySelector("audio")?.duration;
  return [timeline?.getBoundingClientRect().width ?? 1, duration ?? 0];
}
