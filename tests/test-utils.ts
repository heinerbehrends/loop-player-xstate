import { Page } from "@playwright/test";

export async function waitForAudio(page: Page) {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const audio = document.querySelector("audio");
      if (audio) {
        audio.addEventListener("loadedmetadata", () => resolve(), {
          once: true,
        });
      } else {
        resolve();
      }
    });
  });
}
