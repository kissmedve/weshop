const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  url: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  titleExt: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  basePrice: {
    type: String,
  },
  price: {
    type: String,
  },
  shop: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
