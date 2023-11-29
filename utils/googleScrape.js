// import puppeteer from "puppeteer";

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://www.google.com");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Typing and submitting the form
  await page.type('textarea[name="q"]', "cat");

  // evalue input[type=submit] before click
  const submitBtn = await page.$("input[type=submit]");
  await submitBtn.evaluate((btn) => btn.click());

  // console log the next page results
  await page.waitForNavigation();
  console.log("New page URL:", page.url());

  await browser.close();
})();
