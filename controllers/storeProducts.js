const express = require("express");
const scrapeDM = require("./scrapeDM");
const scrapeMytime = require("./scrapeMytime");
const scrapeRewe = require("./scrapeRewe");
const dm = require("../data/dmtest.json");
const mytime = require("../data/mytime.json");
const rewe = require("../data/rewe.json");
const rewetest = require("../data/rewetest.json");

let Product = require("../models/product");

let shopItems = [];

const storeProducts = async (shop) => {
  console.log("hey, i am ", shop);

  const storeDmProducts = async (shopUrls) => {
    for (let i = 0; i < shopUrls.length; i++) {
      shopItem = await scrapeDM(shopUrls[i]);
      if (shopItem !== null) {
        await console.log(shopItem.title);
        await shopItems.push(shopItem);
      }
    }
  };

  const storeMytimeProducts = async (shopUrls) => {
    for (let k = 0; k < shopUrls.length; k++) {
      shopItem = await scrapeMytime(shopUrls[k]);
      if (shopItem !== null) {
        await shopItems.push(shopItem);
      }
    }
  };

  const storeReweProducts = async (shopUrls) => {
    for (let l = 0; l < shopUrls.length; l++) {
      shopItem = await scrapeRewe(shopUrls[l]);
      if (shopItem !== null) {
        await shopItems.push(shopItem);
      }
    }
  };

  switch (shop) {
    case "dm":
      shopUrls = dm.urls;
      await storeDmProducts(shopUrls);
      break;
    case "dmtest":
      shopUrls = dmtest.urls;
      storeDmProducts(shopUrls);
      break;
    case "mytime":
      shopUrls = mytime.urls;
      await storeMytimeProducts(shopUrls);
      break;
    case "mytimetest":
      shopUrls = mytimetest.urls;
      await storeMytimeProducts(shopUrls);
      break;
    case "rewe":
      shopUrls = rewe.urls;
      await storeReweProducts(shopUrls);
      break;
    case "rewetest":
      shopUrls = rewetest.urls;
      await storeReweProducts(shopUrls);
      break;
    default:
      null;
  }

  // // version for new imports:
  // for (const item of shopItems) {
  //   await console.log("look for item in db: ", item.title);
  //   await Product.findOne({ url: item.url })
  //     .then((prod) => {
  //       if (prod) {
  //         console.log(prod.title, " already exists");
  //       } else {
  //         console.log("add: ", item.title);
  //         const newProduct = new Product({
  //           url: item.url,
  //           imgUrl: item.imgUrl,
  //           title: item.title,
  //           titleExt: item.titleExt,
  //           basePrice: item.basePrice,
  //           price: item.price,
  //           shop: item.shop,
  //         });
  //         newProduct.save();
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }

  // version for updates or imports:
  for (const item of shopItems) {
    await console.log("look for item in db: ", item.title);
    await Product.findOneAndUpdate(
      { url: item.url },
      {
        imgUrl: item.imgUrl,
        title: item.title,
        titleExt: item.titleExt,
        basePrice: item.basePrice,
        price: item.price,
        shop: item.shop,
      },
      {
        new: true,
        upsert: true,
        useFindAndModify: false,
      })
  };

};

module.exports = storeProducts;
