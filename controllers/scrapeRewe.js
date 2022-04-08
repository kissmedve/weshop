const puppeteer = require("puppeteer");

async function scrapeRewe(url) {
  try {
    var shopItem = {};
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // mask our identity
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/81.0.4044.138 Chrome/81.0.4044.138 Safari/537.36"
    );
    // REWE prices and availability are localized to the shop you'll get your goods from (curbside pickup or local delivery service). therefore you can only get in after choosing "your" shop - 1) zip code, 2) available shops in the area, 3) curbside pickup or delivery (the latter isn't universally available).
    // every user movement is heavily monitored  by means of cookies and localstorage data.
    // as a bot you can't just click through to a shop, somewhere you get marked. IP address? IP plus something else? what exactly, remains to be tested.
    // so, for now we are pulling only title and image...

    // 2022-04-04
    // "#pdr-product-details-component"
    // ".pdpr-ProductMedia .pdsr-ResponsiveImage img"
    // "#pdpr-ProductInformation .pdpr-Title"
    // "#pdpr-ProductInformation .pdpr-RegulatedProductName"
    //

    await page.goto(url);

    await page.waitForSelector("#pdpr-product-details-component");

    let imageSelector = ".pdpr-ProductMedia .pdsr-ResponsiveImage img";

    const imgUrl = await page.$eval(imageSelector, (img) =>
      img.getAttribute("src")
    );

    let titleSelector = "#pdpr-ProductInformation h1.pdpr-Title";

    const title = await page.$eval(titleSelector, (h1) => h1.innerText);

    let titleExtSelector =
      "#pdpr-ProductInformation .pdpr-RegulatedProductName";

    const titleExt = await page.$eval(titleExtSelector, (div) => div.innerText);

    shopItem = {
      url: url,
      imgUrl: imgUrl,
      title: title,
      titleExt: titleExt,
      baseprice: null,
      price: null,
      shop: "rewe",
    };

    await browser.close();
  } catch (err) {
    console.log(err);
  }
  // console.log(shopItem);
  return shopItem;
}

module.exports = scrapeRewe;
