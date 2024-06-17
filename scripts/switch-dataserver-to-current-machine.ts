#! /usr/bin/env bun

console.log("running");

import { Browser, Builder, By } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

async function automaticLogin() {
  const options = new Options();
  options.setChromeBinaryPath(
    "/etc/profiles/per-user/doppler/bin/google-chrome-stable",
  );
  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
  try {
    await driver.get("http://ecowitt/");
    const loginButton = await driver.findElement(By.className("common-btn"));
    await loginButton.click();
  } catch (err) {
    console.log(err);
  } finally {
    // await driver.quit();
  }
}
automaticLogin();
