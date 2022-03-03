const filterParams = (selectedTags, selectedShop) => {
  if (
    selectedTags !== undefined &&
    selectedTags.length > 0 &&
    selectedShop !== undefined
  ) {
    return { tags: { $all: selectedTags }, shop: selectedShop };
  }
  if (
    selectedTags !== undefined &&
    selectedTags.length > 0 &&
    selectedShop === undefined
  ) {
    return { tags: { $all: selectedTags } };
  }
  if (selectedTags === undefined && selectedShop !== undefined) {
    return { shop: selectedShop };
  }
  if (selectedTags === undefined && selectedShop === undefined) {
    return {};
  }
};

module.exports = filterParams;
