import { test, expect, Page } from "@playwright/test";
import { waitForAudio } from "./test-utils";

const PRECISION = 0.25;

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("/");
  await waitForAudio(page);
});

test.afterAll(async () => {
  await page.close();
});

test("seek to 10% of the timeline when 1 is pressed", async () => {
  await page.getByTestId("timeline").focus();
  await page.keyboard.press("1");
  const [currentTime, duration] = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return [audio?.currentTime, audio?.duration ?? 0];
  });
  expect(currentTime).toBeCloseTo(duration * 0.1, PRECISION);
});

test("seek to 10sec ahead when right arrow is pressed", async () => {
  await page.getByTestId("timeline").focus();
  await page.keyboard.press("ArrowRight");
  const [currentTime] = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return [audio?.currentTime];
  });
  expect(currentTime).toBeCloseTo(10, PRECISION);
});

test("seek to 10sec behind when left arrow is pressed", async () => {
  await page.getByTestId("timeline").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  const [currentTime] = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return [audio?.currentTime];
  });
  expect(currentTime).toBeCloseTo(0, PRECISION);
});

test("progress indicator initial state", async () => {
  const progressIndicator = page.getByRole("progressbar");
  await expect(progressIndicator).toBeEnabled();
  await expect(progressIndicator).toHaveAttribute(
    "aria-label",
    /Audio progress/
  );
  await expect(progressIndicator).toHaveAttribute("aria-valuemin", "0");
  await expect(progressIndicator).toHaveAttribute("aria-valuenow", "0");
});
