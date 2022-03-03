if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  // show/hide dropdown menu
  var navMenu = document.getElementById("navbar");
  var navToggler = document.getElementById("navbar-toggler");
  navToggler.addEventListener("click", navToggle, false);
  function navToggle() {
    navToggler.classList.toggle("is-active");
    navMenu.classList.toggle("is-active");
  }

  // create CSV button
  var createCsvButton = document.getElementById("create-csv");
  createCsvButton.addEventListener("click", createCSV, false);
  function createCSV(event) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/csv");
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("success!", xhr);
      } else {
        console.log("The request failed!");
      }
    };
    xhr.send();
  }

  // identify the page we are on
  var firstContainer = document.getElementsByClassName("container")[1];

  // print button on products and itemlist pages
  if (
    firstContainer.classList.contains("products") ||
    firstContainer.classList.contains("cart")
  ) {
    var printButton = document.getElementById("print");
    printButton.addEventListener("click", printPage, false);
    function printPage() {
      window.print();
    }
  }

  // filter accordion in products and products/admin pages
  if (
    firstContainer.classList.contains("products") ||
    firstContainer.classList.contains("productsadmin")
  ) {
    // show/hide filter form
    var filterToggler = document.getElementById("filter-toggler");
    var filterForm = document.getElementById("filter-form");
    var filterFormHeight = filterForm.scrollHeight + "px";

    filterForm.classList.add("is-closed");
    filterToggler.classList.add("is-closed");

    filterToggler.addEventListener("click", filterAcc, false);

    function filterAcc() {
      filterForm.classList.toggle("is-closed");
      filterToggler.classList.toggle("is-closed");
      if (!filterForm.classList.contains("is-closed")) {
        filterForm.style.maxHeight = filterFormHeight;
      } else {
        filterForm.style.maxHeight = 0;
      }
    }
  }

  // add custom line item to cartlist via localstorage
  if (firstContainer.classList.contains("cart")) {
    var customLineItemButton = document.getElementById("add-custom-line");
    var closeCustomLineItemButton = document.getElementById(
      "close-custom-line"
    );
    var customLineItemModal = document.getElementById("customline-modal");

    // open modal
    customLineItemButton.addEventListener(
      "click",
      openCustomLineItemModal,
      false
    );
    function openCustomLineItemModal(event) {
      customLineItemModal.classList.add("is-active");
    }
    // close modal
    closeCustomLineItemButton.addEventListener(
      "click",
      closeCustomLineItemModal,
      false
    );
    function closeCustomLineItemModal(event) {
      customLineItemModal.classList.remove("is-active");
    }

    // add custom line item
    var customLineItemForm = document.getElementById("customline");
    customLineItemForm.addEventListener("submit", insertCustomLineItem, false);

    function insertCustomLineItem(event) {
      event.preventDefault();

      var customLineItemTitle = document.getElementById(
        "custom-lineitem-title"
      );
      console.log(customLineItemTitle.value);

      var storedList = JSON.parse(localStorage.getItem("weShopList")) || [];
      console.log(storedList);
      console.log("storedList[0].itemId", storedList[0].itemId);

      var insertedIds = [];
      for (var i = 0; i < storedList.length; i++) {
        if (storedList[i].itemId.substring(0, 6) === "insert") {
          insertedIds.push(storedList[i].itemId);
        }
      }
      var insertedItemId = "inserted_" + (insertedIds.length + 1);

      var insertedItemTitle = customLineItemTitle.value;

      // prepare item to add
      var insertedItem = {
        itemId: insertedItemId,
        itemTitle: insertedItemTitle,
        itemPrice: "",
        countUser1: 0,
        countUser2: 0,
      };
      console.log(insertedItem);
      // additem to array
      storedList.push(insertedItem);
      console.log(storedList);

      // save list to localStorage
      localStorage.setItem("weShopList", JSON.stringify(storedList));
    }
  }

  // admin functions on products admin page
  if (firstContainer.classList.contains("productsadmin")) {
    // delete item
    var deleteButtons = document.getElementsByClassName("delete-item");
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deleteItem, false);
    }

    function deleteItem(event) {
      event.preventDefault();
      var deleteId = event.target.getAttribute("data-id");
      var xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/del/" + deleteId);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("success!", xhr);
        } else {
          console.log("The request failed!");
        }
      };
      xhr.send();
    }

    // start a fresh item list => delete all items from localstorage
    var cleanseLocaleStorageButton = document.getElementById("start-list");
    cleanseLocaleStorageButton.addEventListener(
      "click",
      deleteAllStorageValues,
      false
    );

    function deleteAllStorageValues(event) {
      event.preventDefault();
      var storedList = [];
      localStorage.setItem("weShopList", JSON.stringify(storedList));
    }

    // collect items for items list
    var addToListButtons = document.getElementsByClassName("add-to-list");
    for (var i = 0; i < addToListButtons.length; i++) {
      addToListButtons[i].addEventListener("click", addItemToList, false);
    }

    function addItemToList(event) {
      event.preventDefault();

      var storedList = JSON.parse(localStorage.getItem("weShopList")) || [];
      console.log(storedList);

      // get needed values
      var itemId = event.target.getAttribute("data-id");
      var addToListButton = event.target;
      var cardContent = addToListButton.parentNode.parentNode.children[0];
      var itemTitle = cardContent.querySelector(".product-title").innerText;
      var itemPriceString = cardContent
        .querySelector(".price")
        .innerText.split(" ")[0]
        .split(",")
        .join(".");
      var itemPrice = parseFloat(itemPriceString);

      // bundle item
      var addedItem = {
        itemId: itemId,
        itemTitle: itemTitle,
        itemPrice: itemPrice,
        countUser1: 0,
        countUser2: 0,
      };

      // add item to list array
      storedList.push(addedItem);
      // save list to localStorage
      localStorage.setItem("weShopList", JSON.stringify(storedList));
    }
  }

  // item list page
  if (firstContainer.classList.contains("cart")) {
    // get items from localStorage
    var itemListArray = JSON.parse(localStorage.getItem("weShopList"));

    // prepare the table parts to print out the contents
    var itemList = document.getElementById("itemlist");
    itemList.innerHTML = "";
    var subtotals = document.getElementById("subtotals");
    subtotals.innerHTML = "";
    var extras = document.getElementById("extras");
    extras.innerHTML = "";
    var totals = document.getElementById("totals");
    totals.innerHTML = "";

    var extraPositionForm = document.getElementById("extra-positions-form");
    extraPositionForm.innerHTML = "";

    var subtotalUser1 = 0;
    var subtotalUser2 = 0;
    var subtotalAll = 0;

    // put together item rows
    for (var i = 0; i < itemListArray.length; i++) {
      // line item rows
      console.log(itemListArray[i].itemId);
      if (itemListArray[i].itemId.substring(0, 5) !== "extra") {
        var quantityUser1 = itemListArray[i].countUser1;
        var quantityUser2 = itemListArray[i].countUser2;

        var lineItemTotalUser1 = (
          Math.round(quantityUser1 * itemListArray[i].itemPrice * 100) / 100
        ).toFixed(2);
        var lineItemTotalUser2 = (
          Math.round(quantityUser2 * itemListArray[i].itemPrice * 100) / 100
        ).toFixed(2);

        var quantityTotal = parseInt(quantityUser1) + parseInt(quantityUser2);
        var lineItemTotal = (
          Math.round(quantityTotal * itemListArray[i].itemPrice * 100) / 100
        ).toFixed(2);

        // print out line item row
        var itemListRow = "";
        itemListRow +=
          '<tr class="item" data-id="' + itemListArray[i].itemId + '">';
        itemListRow +=
          '<td class="item-name">' + itemListArray[i].itemTitle + "</td>";
        itemListRow +=
          '<td class="item-price price"><input class="cart-price-input" type="number" step="0.01" value="' +
          itemListArray[i].itemPrice +
          '"> €</td>';
        itemListRow +=
          '<td class="quantity-user1"><input class="cart-quantity-input" type="number" value="' +
          quantityUser1 +
          '"></td>';
        itemListRow +=
          '<td class="lineitem-total-user1 price">' +
          lineItemTotalUser1 +
          " €</td>";
        itemListRow +=
          '<td class="quantity-user2"><input class="cart-quantity-input" type="number" value="' +
          quantityUser2 +
          '"></td>';
        itemListRow +=
          '<td class="lineitem-total-user2 price">' +
          lineItemTotalUser2 +
          " €</td>";
        itemListRow += '<td class="quantity-all">' + quantityTotal + "</td>";
        itemListRow +=
          '<td class="lineitem-total-all price">' + lineItemTotal + " €</td>";
        itemListRow +=
          '<td><button class="button is-small has-background-orange has-text-orange delete-item" title="delete item" data-id="' +
          itemListArray[i].itemId +
          '"<span class="icon is-small"><i class="fa fa-times-circle"></i></span></button></td>';
        itemListRow += "</tr>";
        itemList.innerHTML += itemListRow;
      }
    }

    // print out subtotals row

    var subtotalsRow = "";
    subtotalsRow += '<tr id="itemtotals">';
    subtotalsRow += '<td class="totals-item-title"></td>';
    subtotalsRow += "<td></td>";
    subtotalsRow += "<td></td>";
    subtotalsRow +=
      '<td class="subtotal-user1 price">' + subtotalUser1 + " €</td>";
    subtotalsRow += "<td></td>";
    subtotalsRow +=
      '<td class="subtotal-user2 price">' + subtotalUser2 + " €</td>";
    subtotalsRow += "<td></td>";
    subtotalsRow += '<td class="subtotal-all price">' + subtotalAll + " €</td>";
    subtotalsRow += "<td></td>";
    subtotalsRow += "</tr>";
    subtotals.innerHTML += subtotalsRow;

    updateSubtotals();

    // print out extraPositions

    for (var k = 0; k < itemListArray.length; k++) {
      var itemId = itemListArray[k].itemId;
      var extraTitle = itemListArray[k].extraTitle;
      var extraPrice = itemListArray[k].extraPrice;
      var extraDistribution = itemListArray[k].extraDistro;

      if (itemListArray[k].itemId.substring(0, 5) === "extra") {
        // print out extras row
        addExtraRow(itemId, extraTitle, extraPrice, extraDistribution);
      }
    }

    addTotals();
    updateTotals();

    // =======================================

    // add event listeners

    // price input
    var priceInputs = document.getElementsByClassName("cart-price-input");
    for (var i = 0; i < priceInputs.length; i++) {
      priceInputs[i].addEventListener("change", getPrices, false);
    }

    // quantity inputs
    var quantityInputs = document.getElementsByClassName("cart-quantity-input");
    for (var i = 0; i < quantityInputs.length; i++) {
      quantityInputs[i].addEventListener("change", getQuantities, false);
    }

    // delete line item
    var removeLineItem = document.getElementsByClassName("delete-item");
    for (var i = 0; i < removeLineItem.length; i++) {
      removeLineItem[i].addEventListener("click", deleteLineItem, false);
    }

    // add extra position form
    var addForm = document.getElementById("add-form");
    addForm.addEventListener("click", addExtraPositionForm, false);

    // save list changes / update local storage
    var saveList = document.getElementById("save");
    saveList.addEventListener("click", saveListChanges, false);

    // =======================================

    // functions

    function getPrices(event) {
      var priceInput = event.target;
      if (isNaN(priceInput.value) || priceInput.value <= 0) {
        priceInput.value = 0;
      }

      var itemId = priceInput.parentNode.parentNode.getAttribute("data-id");

      updateLineItemTotals(itemId);
    }

    function getQuantities(event) {
      var quantityInput = event.target;
      if (isNaN(quantityInput.value) || quantityInput.value <= 0) {
        quantityInput.value = 0;
      }

      var itemId = quantityInput.parentNode.parentNode.getAttribute("data-id");

      updateLineItemTotals(itemId);
    }

    // update line item totals after price or quantity changed
    function updateLineItemTotals(currentItemId) {
      var currentItem = document.querySelector(
        '.item[data-id="' + currentItemId + '"]'
      );

      var itemPrice = currentItem.querySelector(".item-price").children[0]
        .value;

      var lineItemQuantityUser1 = currentItem.querySelector(".quantity-user1")
        .children[0].value;
      var lineItemQuantityUser2 = currentItem.querySelector(".quantity-user2")
        .children[0].value;

      var lineItemTotalUser1 = (
        Math.round(lineItemQuantityUser1 * itemPrice * 100) / 100
      ).toFixed(2);
      currentItem.querySelector(".lineitem-total-user1").innerText =
        lineItemTotalUser1 + " €";

      var lineItemTotalUser2 = (
        Math.round(lineItemQuantityUser2 * itemPrice * 100) / 100
      ).toFixed(2);
      currentItem.querySelector(".lineitem-total-user2").innerText =
        lineItemTotalUser2 + " €";

      var quantityTotal =
        parseInt(lineItemQuantityUser1) + parseInt(lineItemQuantityUser2);
      currentItem.querySelector(".quantity-all").innerText = quantityTotal;

      var lineItemTotal = (
        Math.round(quantityTotal * itemPrice * 100) / 100
      ).toFixed(2);

      currentItem.querySelector(".lineitem-total-all").innerText =
        lineItemTotal + " €";

      updateSubtotals();
    }

    // update subtotals
    function updateSubtotals() {
      subtotalUser1 = 0;
      subtotalUser2 = 0;
      subtotalAll = 0;

      for (var i = 0; i < itemList.children.length; i++) {
        subtotalUser1 += parseFloat(
          itemList.children[i]
            .querySelector(".lineitem-total-user1")
            .innerText.split(" ")[0]
        );
        subtotalUser2 += parseFloat(
          itemList.children[i]
            .querySelector(".lineitem-total-user2")
            .innerText.split(" ")[0]
        );
        subtotalAll += parseFloat(
          itemList.children[i]
            .querySelector(".lineitem-total-all")
            .innerText.split(" ")[0]
        );
      }
      subtotalUser1 = (Math.round(subtotalUser1 * 100) / 100).toFixed(2);
      subtotalUser2 = (Math.round(subtotalUser2 * 100) / 100).toFixed(2);
      subtotalAll = (Math.round(subtotalAll * 100) / 100).toFixed(2);

      subtotals.querySelector(".subtotal-user1").innerText =
        subtotalUser1 + " €";
      subtotals.querySelector(".subtotal-user2").innerText =
        subtotalUser2 + " €";
      subtotals.querySelector(".subtotal-all").innerText = subtotalAll + " €";

      updateExtraPositions();
      updateTotals();
    }

    // add custom line items (shipping, discounts etc.)

    function addExtraPositionForm() {
      var extraPosForm = "";
      extraPosForm += '<form class="add-extra-position-form">';
      extraPosForm += '<div class="field">';
      extraPosForm += '<label class="label">Name</label>';
      extraPosForm += '<div class="control">';
      extraPosForm += '<input id="extra-name" class="input" type="text">';
      extraPosForm += "</div>";
      extraPosForm += "</div>";
      extraPosForm += '<div class="field">';
      extraPosForm += '<label class="label">Price</label>';
      extraPosForm += '<div class="control">';
      extraPosForm +=
        '<input id="extra-price" class="input" type="number" step="0.01" value="0.00">';
      extraPosForm += "</div>";
      extraPosForm += "</div>";
      extraPosForm += '<div class="field">';
      extraPosForm += '<label class="tag-group">Distribute the price</label>';
      extraPosForm += '<div class="control">';
      extraPosForm += '<label for="evenly" class="radio">';
      extraPosForm +=
        '<input type="radio" name="distribute" id="evenly" value="evenly" />';
      extraPosForm += "evenly</label>";
      extraPosForm += "</div>";
      extraPosForm += '<div class="control">';
      extraPosForm +=
        '<label for="proportionately" class="radio extra-distribution">';
      extraPosForm +=
        '<input type="radio" name="distribute" id="proportionately" value="proportionately" />';
      extraPosForm += "proportionately</label>";
      extraPosForm += "</div>";
      extraPosForm += "</div>";
      extraPosForm += '<div class="field block">';
      extraPosForm += '<div class="control">';
      extraPosForm +=
        '<input id="add-extra-form" class="button has-background-grey-dark has-text-white" value="Add position" >';
      extraPosForm += "</div>";
      extraPosForm += "</div>";
      extraPosForm += "</form>";
      extraPositionForm.innerHTML = extraPosForm;

      var formAddButton = document.getElementById("add-extra-form");
      formAddButton.addEventListener("click", addExtraPosition, false);
    }

    function addExtraPosition(event) {
      event.preventDefault();

      var itemId = "";
      if (extras.innerHTML === "") {
        itemId = "extra-1";
      } else {
        var existingPositions = document.querySelector(".extra-position")
          .length;
        itemId = "extra-" + (existingPositions + 1);
      }
      var extraTitle = document.querySelector("#extra-name").value;
      var extraPrice = document.querySelector("#extra-price").value;
      extraPrice = parseFloat(extraPrice).toFixed(2);
      var extraDistribution = document.querySelector(
        'input[name="distribute"]:checked'
      ).value;

      addExtraRow(itemId, extraTitle, extraPrice, extraDistribution);

      removeExtraPosForm();
      addTotals();
      updateTotals();
    }

    function addExtraRow(itemId, extraTitle, extraPrice, extraDistribution) {
      var distributeUser1, distributeUser2;

      if (subtotalAll !== 0) {
        if (extraDistribution === "evenly") {
          distributeUser1 = distributeUser2 = (
            Math.round(extraPrice * 0.5 * 100) / 100
          ).toFixed(2);
        } else if (extraDistribution === "proportionately") {
          distributeUser1 = (
            Math.round((subtotalUser1 / subtotalAll) * extraPrice * 100) / 100
          ).toFixed(2);
          distributeUser2 = (
            Math.round((subtotalUser2 / subtotalAll) * extraPrice * 100) / 100
          ).toFixed(2);
        }
      } else {
        distributeUser1 = distributeUser2 = "n/a";
      }

      var extraPosition = "";
      extraPosition += '<tr class="extra-position" data-id="' + itemId + '">';
      extraPosition += '<td class="extra-title">' + extraTitle + "</td>";
      extraPosition += "<td></td>";
      extraPosition += "<td></td>";
      extraPosition +=
        '<td class="extra-price-user1 price">' + distributeUser1 + " €</td>";
      extraPosition += "<td></td>";
      extraPosition +=
        '<td class="extra-price-user2 price">' + distributeUser2 + " €</td>";
      extraPosition += "<td></td>";
      extraPosition +=
        '<td class="extra-price price" data-distro="' +
        extraDistribution +
        '">' +
        extraPrice +
        " €</td>";
      extraPosition +=
        '<td><button class="button is-small has-background-orange has-text-orange delete-position" title="delete position"><span class="icon is-small"><i class="fa fa-times-circle"></i></span></button></td>';
      extraPosition += "</tr>";
      extras.innerHTML += extraPosition;

      var deleteExtraPosition = document.getElementsByClassName(
        "delete-position"
      );
      for (var i = 0; i < deleteExtraPosition.length; i++) {
        deleteExtraPosition[i].addEventListener("click", deletePosition, false);
      }

      // removeExtraPosForm();
      // addTotals();
      // updateTotals();
    }

    function updateExtraPositions() {
      subtotalUser1 = parseFloat(subtotalUser1);
      subtotalUser2 = parseFloat(subtotalUser2);
      subtotalAll = parseFloat(subtotalAll);

      var extraPrices = document.getElementsByClassName("extra-price");
      var distributions1 = document.getElementsByClassName("extra-price-user1");
      var distributions2 = document.getElementsByClassName("extra-price-user2");

      if (subtotalAll > 0) {
        for (var i = 0; i < distributions1.length; i++) {
          var currExtraPrices = parseFloat(
            extraPrices[i].innerText.split(" ")[0]
          );
          var currDistributions1 = 0;
          var currDistributions2 = 0;

          if (extraPrices[i].getAttribute("data-distro") === "evenly") {
            currDistributions1 = currDistributions2 = (
              Math.round(currExtraPrices * 0.5 * 100) / 100
            ).toFixed(2);
          } else if (
            extraPrices[i].getAttribute("data-distro") === "proportionately"
          ) {
            currDistributions1 = (
              Math.round(
                (subtotalUser1 / subtotalAll) * currExtraPrices * 100
              ) / 100
            ).toFixed(2);
            currDistributions2 = (
              Math.round(
                (subtotalUser2 / subtotalAll) * currExtraPrices * 100
              ) / 100
            ).toFixed(2);
          }
          distributions1[i].innerText = currDistributions1 + " €";
          distributions2[i].innerText = currDistributions2 + " €";
        }
      } else if (subtotalAll === 0) {
        for (var i = 0; i < distributions1.length; i++) {
          distributions1[i].innerText = "n/a €";
          distributions2[i].innerText = "n/a €";
        }
      }
      updateTotals();
    }

    function deleteLineItem(event) {
      var deleteLineItemButton = event.target;
      var lineItemId = event.target.getAttribute("data-id");

      // delete line item
      deleteLineItemButton.parentNode.parentNode.remove();

      // get stored item list, filter it, and restore the filtered list
      var weShopList = JSON.parse(localStorage.getItem("weShopList"));
      function filterItemIds(itemId, lineItemId) {
        itemId !== lineItemId;
      }
      var weShopListFiltered = weShopList.filter(filterItemIds);
      // var weShopListFiltered = weShopList.filter(
      //   (item) => item.itemId !== lineItemId
      // );
      localStorage.setItem("weShopList", JSON.stringify(weShopListFiltered));

      updateSubtotals();
    }

    function removeExtraPosForm() {
      document.getElementById("extra-positions-form").remove();
    }

    function deletePosition(event) {
      var deletePosButton = event.target;
      deletePosButton.parentNode.parentNode.remove();

      updateTotals();
    }

    function updateTotals() {
      var extras = document.getElementById("extras").innerText;
      if (extras !== "") {
        var extras = document.getElementById("extras").children;
        var extraPositionsUser1 = document.getElementsByClassName(
          "extra-price-user1"
        );
        var extraPositionsUser2 = document.getElementsByClassName(
          "extra-price-user2"
        );
        var extraPositions = document.getElementsByClassName("extra-price");

        var totalUser1 = parseFloat(subtotalUser1);
        var totalUser2 = parseFloat(subtotalUser2);
        var totalAll = parseFloat(subtotalAll);

        for (var i = 0; i < extras.length; i++) {
          totalUser1 += parseFloat(
            extraPositionsUser1[i].innerText.split(" ")[0]
          );
          totalUser2 += parseFloat(
            extraPositionsUser2[i].innerText.split(" ")[0]
          );
          totalAll += parseFloat(extraPositions[i].innerText.split(" ")[0]);
        }

        totalUser1 = (Math.round(totalUser1 * 100) / 100).toFixed(2);
        totalUser2 = (Math.round(totalUser2 * 100) / 100).toFixed(2);
        totalAll = (Math.round(totalAll * 100) / 100).toFixed(2);

        if (isNaN(totalUser1)) {
          totalUser1 = totalUser2 = "n/a";
        }

        totals.querySelector(".total-user1").innerText = totalUser1 + " €";
        totals.querySelector(".total-user2").innerText = totalUser2 + " €";
        totals.querySelector(".total-all").innerText = totalAll + " €";
      } else if (extras === "" && totals.innerHTML !== "") {
        totals.innerHTML = "";
      }
    }

    function addTotals() {
      if (totals.innerHTML === "") {
        var totalsRow = "";
        totalsRow += '<tr id="total">';
        totalsRow += '<td class="total-title">Totals</td>';
        totalsRow += "<td></td>";
        totalsRow += "<td></td>";
        totalsRow += '<td class="total-user1 price">0.00 €</td>';
        totalsRow += "<td></td>";
        totalsRow += '<td class="total-user2 price">0.00 €</td>';
        totalsRow += "<td></td>";
        totalsRow += '<td class="total-all price">0.00 €</td>';
        totalsRow += "<td></td>";
        totalsRow += "</tr>";
        totals.innerHTML += totalsRow;
      }
    }

    function saveListChanges() {
      var itemsToSave = document.querySelectorAll("#itemlist .item");
      var positionsToSave = document.querySelectorAll(".extra-position");

      var storeItems = [];

      var savedItems = [];
      var savedPositions = [];

      for (i = 0; i < itemsToSave.length; i++) {
        var itemToSave = {
          itemId: itemsToSave[i].getAttribute("data-id"),
          itemTitle: itemsToSave[i].querySelector(".item-name").innerText,
          itemPrice: itemsToSave[i].querySelector(".item-price").children[0]
            .value,
          countUser1: itemsToSave[i].querySelector(
            ".quantity-user1 .cart-quantity-input"
          ).value,
          countUser2: itemsToSave[i].querySelector(
            ".quantity-user2 .cart-quantity-input"
          ).value,
        };
        savedItems.push(itemToSave);
      }
      for (i = 0; i < positionsToSave.length; i++) {
        var positionToSave = {
          itemId: "extra" + i,
          extraTitle: positionsToSave[i].querySelector(".extra-title")
            .innerText,
          extraPrice: positionsToSave[i]
            .querySelector(".extra-price")
            .innerText.split(" ")[0],
          extraDistro: positionsToSave[i]
            .querySelector(".extra-price")
            .getAttribute("data-distro"),
        };
        savedPositions.push(positionToSave);
      }

      storeItems = savedItems.concat(savedPositions);

      localStorage.setItem("weShopList", JSON.stringify(storeItems));
    }
  }
}
