const paginUrl = (selectedTags, selectedShop) => {
  let urlString = "";
  if (typeof selectedTags === "string") {
    urlString += "term=" + selectedTags + "&";
  } else if (typeof selectedTags === "object") {
    selectedTags.map((tag) => {
      `term=${tag}&`;
      urlString += "term=" + tag + "&";
    });
  }
  if (typeof selectedShop === "string") {
    urlString += "shop=" + selectedShop + "&";
  } else if (typeof selectedTags === "object") {
    selectedTags.map((shop) => {
      `term=${tag}&`;
      urlString += "shop=" + shop + "&";
    });
  }
  urlString += "page=";
  return urlString;
};

module.exports = paginUrl;
