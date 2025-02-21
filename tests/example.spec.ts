import { test, expect } from "@playwright/test";
import { getSimplePaths } from "@xstate/graph";
import { loopPlayerMachine } from "../src/machine";

const paths = getSimplePaths(loopPlayerMachine);

paths.forEach((path, pathIndex) => {
  path.steps.forEach((step, stepIndex) => {
    test(`loading - path ${pathIndex} step ${stepIndex}`, async ({ page }) => {
      await page.goto("http://localhost:5173/");
      if (step.event.type === "TOGGLE_PLAY") {
        if (step.state.value !== "playing") {
          await page.getByRole("button", { name: /Pause/ }).click();
        }
        if (step.state.value === "playing") {
          await page.getByRole("button", { name: /Play/ }).click();
        }
      }
      if (step.state.value === "loading") {
        await expect(page.getByRole("button", { name: /Play/ })).toBeDisabled();
      }
      if (step.state.value === "paused") {
        await expect(page).toHaveTitle(/LoopPlayer/);
        await expect(page.getByRole("button", { name: /Play/ })).toBeVisible();
        await expect(page.getByRole("button", { name: /Pause/ })).toBeEnabled();
        const isPlaying = await page.evaluate(() => {
          const audio = document.querySelector("audio");
          return audio && !audio.paused;
        });
        await expect(isPlaying).toBe(false);
      }
      if (step.state.value === "playing") {
        await expect(page.getByRole("button", { name: /Pause/ })).toBeVisible();
        const isPlaying = await page.evaluate(() => {
          const audio = document.querySelector("audio");
          return audio && !audio.paused;
        });
        await expect(isPlaying).toBe(true);
      }
    });
  });
});

test("audio toggles when play button is clicked", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Click the play button
  await page.getByRole("button", { name: /Play/ }).click();
  await expect(page.getByRole("button", { name: /Pause/ })).toBeVisible();
  const isPlaying = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio && !audio.paused;
  });
  await expect(isPlaying).toBe(true);

  // Click the pause button
  await page.getByRole("button", { name: /Pause/ }).click();
  await expect(page.getByRole("button", { name: /Play/ })).toBeVisible();
  const isPaused = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    return audio && audio.paused;
  });
  await expect(isPaused).toBe(true);
});
