const puppeteer = require("puppeteer");

async function scrapeMytime(url) {
  try {
    var shopItem = {};
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // page.setUserAgent();
    await page.goto(url);

    await page.waitForSelector("#content");

    const imgUrl = await page.$eval(
      '.gallery__slider__item[data-slick-index="0"] img',
      (img) => img.getAttribute("src")
    );
    const title = await page.$eval("h1 span", (h1) => h1.innerText);
    const titleExt = await page.$eval("h1 small", (h1ext) => h1ext.innerText);
    const price = await page.$eval(
      ".product-page__price--current strong",
      (price) => price.innerText
    );
    const baseprice = await page.$eval(
      ".product-page__bulk-price",
      (baseprice) => baseprice.innerText
    );

    shopItem = {
      url: url,
      imgUrl: imgUrl,
      title: title,
      titleExt: titleExt,
      baseprice: baseprice,
      price: price,
      shop: "mytime",
    };

    await browser.close();
  } catch (err) {
    console.log(err);
  }
  console.log(shopItem);
  return shopItem;
}

module.exports = scrapeMytime;
