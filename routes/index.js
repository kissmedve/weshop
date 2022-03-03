const express = require("express");
const router = require("express").Router();
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const filterParams = require("../helpers/filterParams");
const paginUrl = require("../helpers/paginUrl");

const storeProducts = require("../controllers/storeProducts");

let Product = require("../models/product");

// Home page
router.get("/", (req, res) => {
  res.render("index");
});

// Display load form (for url list files)
router.get("/upload", (req, res) => {
  res.render("load", { layout: "main" });
});

// Load up data file (urls list)
router.post("/upload", (req, res) => {
  let shop = req.body.scrape;
  storeProducts(shop);
  res.redirect("/upload");
});

// Display product listings with tags form
// Used to assign tags to newly imported items in bulk
router.get("/tagsedit/:page", async (req, res) => {
  const currentPage = req.params.page || 1;
  const resultsPerPage = 20;
  const numOfResults = await Product.countDocuments({}).lean();
  const numOfPages = Math.ceil(numOfResults / resultsPerPage);

  await Product.find({}, "title _id tags", {
    skip: resultsPerPage * currentPage - resultsPerPage,
    limit: resultsPerPage,
  })
    .sort([["_id", "desc"]])
    .lean()
    .then((product) => {
      res.render("tagsedit", {
        product: product,
        currentPage: currentPage,
        pages: numOfPages,
        totalResults: numOfResults,
        currentUrl: "/tagsedit/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Update product item tags
router.post("/tagsedit/:page", (req, res) => {
  const currentPage = req.params.page;
  // submit returns values for multiple id's
  const form = JSON.parse(JSON.stringify(req.body));
  const arrayedForm = Object.entries(form);
  arrayedForm.map((item) => {
    Product.updateOne({ _id: item[0] }, { tags: item[1] })
      .then((product) => {
        console.log("item(s) successfully updated");
        res.redirect("../tagsedit/1");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// Display edit form for single product item
router.get("/edit/:id", (req, res) => {
  console.log(req.params.id);
  Product.findById(req.params.id)
    .lean()
    .then((product) => {
      if (!product) {
        res.status(404).json({
          status: "404",
          message: "The requested resource could not be found",
        });
      }
      res.render("edit", { product });
    })
    .catch((error) => {
      error;
    });
});

// Edit product item
router.post("/edit/:id", (req, res) => {
  console.log("req.params.id: ", req.params.id);
  console.log("req.body.price: ", req.body.price);
  console.log("req.body.baseprice: ", req.body.baseprice);
  console.log("req.body.term: ", req.body.term);
  Product.findById(req.params.id)
    .lean()
    .then((product) => {
      const newPrice =
        req.body.price === "" || req.body.price === undefined
          ? product.price
          : req.body.price;
      const newBaseprice =
        req.body.baseprice === "" || req.body.baseprice === undefined
          ? product.basePrice
          : req.body.baseprice;
      const newTags =
        req.body.term === undefined ? product.tags : req.body.term;

      Product.findByIdAndUpdate(
        { _id: req.params.id },
        {
          price: newPrice,
          basePrice: newBaseprice,
          tags: newTags,
        },
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.render("edit", { product });
          }
        }
      );
    })
    .catch((error) => {
      error;
    });
});

// Delete product item
router.delete("/del/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      console.log("deleting");
    })
    .catch((err) => {
      err;
    });
});

// Display product listing with filters,
// All product properties and buttons
router.get("/products/admin", (req, res) => {
  let selectedTags = req.query.term;
  let selectedShop = req.query.shop;
  const currentPage = req.query.page || 1;
  const resultsPerPage = 20;
  let numOfResults = 0;
  let numOfPages = 1;

  Product.countDocuments(filterParams(selectedTags, selectedShop))
    .lean()
    .then((count) => {
      numOfResults = count;
      numOfPages = Math.ceil(numOfResults / resultsPerPage);
    })
    .catch((error) => {
      error;
    });

  Product.find(filterParams(selectedTags, selectedShop))
    .lean()
    .skip(resultsPerPage * currentPage - resultsPerPage)
    .limit(resultsPerPage)
    .sort([["title", "asc"]])
    .then((product) => {
      if (!product) {
        res.status(404).json({
          status: "404",
          message: "The requested resource could not be found",
        });
      }
      res.render("productsadmin", {
        product: product,
        selectedTags: selectedTags,
        selectedShop: selectedShop,
        currentPage: currentPage,
        totalResults: numOfResults,
        pages: numOfPages,
        currentUrl: "/products/admin?" + paginUrl(selectedTags, selectedShop),
      });
    })
    .catch((error) => {
      error;
    });
});

// Display product listing with filters,
// Product pic, price, title, title extension, base price,
// No buttons
router.get("/products", (req, res) => {
  let selectedTags = req.query.term;
  let selectedShop = req.query.shop;
  const currentPage = req.query.page || 1;
  const resultsPerPage = 48;
  let numOfResults = 0;
  let numOfPages = 1;

  Product.countDocuments(filterParams(selectedTags, selectedShop))
    .lean()
    .then((count) => {
      numOfResults = count;
      numOfPages = Math.ceil(numOfResults / resultsPerPage);
    })
    .catch((error) => {
      error;
    });

  Product.find(filterParams(selectedTags, selectedShop))
    .lean()
    .skip(resultsPerPage * currentPage - resultsPerPage)
    .limit(resultsPerPage)
    .sort([["title", "asc"]])
    .then((product) => {
      if (!product) {
        res.status(404).json({
          status: "404",
          message: "The requested resource could not be found",
        });
      }

      res.render("products", {
        product: product,
        selectedTags: selectedTags,
        selectedShop: selectedShop,
        currentPage: currentPage,
        totalResults: numOfResults,
        pages: numOfPages,
        currentUrl: "/products?" + paginUrl(selectedTags, selectedShop),
      });
    })
    .catch((error) => {
      error;
    });
});

// Display list with items stored in localstorage
router.get("/cartlist", (req, res) => {
  res.render("cartlist");
});

// Write csv file of all products
router.get("/csv", (req, res) => {
  Product.find({})
    .lean()
    .then((product) => {
      if (!product) {
        res.status(404).json({
          status: "404",
          message: "The requested resource could not be found",
        });
      }
      const json2csvParser = new Json2csvParser({
        header: true,
        fields: [
          "title",
          "titleExt",
          "imgUrl",
          "basePrice",
          "price",
          "shop",
          "tags",
          "url",
        ],
        encoding: "utf8",
      });
      const csvData = json2csvParser.parse(product);

      const date = new Date();
      const dateString = date.toISOString().split(".")[0].split("T").join("--");
      const fileName = "all-products-" + dateString + ".csv";

      fs.writeFile(fileName, csvData, (error) => {
        if (error) throw error;
        console.log("writing file");
      });
    })
    .catch((error) => {
      error;
    });
});

module.exports = router;
