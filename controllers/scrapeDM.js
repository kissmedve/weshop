const puppeteer = require("puppeteer");

async function scrapeDM(url) {
  try {
    var shopItem = {};
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // page.setUserAgent();
    await page.goto(url);

    // await page.waitForSelector(".b"); // obsolete
    await page.waitForSelector('[data-dmid="product-detail-page"]');

    // const imgUrl = await page.$eval("#product-image-layer img", (img) =>
    //   img.getAttribute("src")
    // );

    const imgUrl = await page.$eval(
      '#detail-image-container .slick-track [data-index="0"] img',
      (img) => img.getAttribute("src")
    );
    // const title = await page.$eval("h1", (h1) => h1.innerText);
    const title = await page.$eval(
      "#main-section-headline-container h1",
      (h1) => h1.innerText
    );

    // new: titleExt for brand
    const titleExt = await page.$eval(
      '[data-dmid="detail-page-headline-brand-name"] a',
      (el) => el.innerText
    );

    const euros = await page.$eval(
      '[data-dmid="price-digit"]',
      (el) => el.innerText
    );
    const cents = await page.$eval(
      '[data-dmid="price-cent"]',
      (el) => el.innerText
    );
    const basePrice = await page.$eval(
      '[data-dmid="product-base-price"]',
      (el) => el.innerText
    );

    let price = euros + "," + cents + " €";

    shopItem = {
      url: url,
      imgUrl: imgUrl,
      title: title,
      titleExt: titleExt,
      basePrice: basePrice,
      price: price,
      shop: "dm",
    };

    // await browser.close();
  } catch (err) {
    console.log(err);
  }
  console.log(shopItem);
  return shopItem;
}

module.exports = scrapeDM;
