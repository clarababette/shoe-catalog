//GET SHOP DATA
let myShop = {};

if (localStorage["shopData"]) {
  myShop = JSON.parse(localStorage.getItem("shopData"));
} else {
  myShop = shoeData;
}

//HANDLEBARS HELPERS
Handlebars.registerHelper("stockCheck", (size) => {
  if (size === undefined || size === 0) {
    return "out-of-stock";
  } else {
    return "in-stock";
  }
});
Handlebars.registerHelper("viewBox", (brand) => {
  switch (brand) {
    case "Crocs":
      return new Handlebars.SafeString("'-5 0 522 380'");
    case "Converse":
      return new Handlebars.SafeString("'-5 10 522 400'");
    case "Vans":
      return new Handlebars.SafeString("'-5 0 522 380'");
    case "Dr-Martens":
      return new Handlebars.SafeString("'0 0 522 512'");
    case "Nike":
      return new Handlebars.SafeString("'-5 0 522 380'");
  }
});
Handlebars.registerHelper("wordToDigit", (word) => {
  switch (word) {
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    default:
      break;
  }
});
Handlebars.registerHelper("costForQty", (unitPrice, qty) => {
  return unitPrice * qty;
});
Handlebars.registerHelper("safeBrand", (brand) => {
  return brand.replace(" ", "-");
});
Handlebars.registerHelper("displayBrand", (brand) => {
  return brand.replace("-", " ");
});
Handlebars.registerHelper("icon", (brand) => {
  switch (brand) {
    case "Crocs":
      return new Handlebars.SafeString("#crocs");
    case "Converse":
      return new Handlebars.SafeString("#converse");
    case "Vans":
      return new Handlebars.SafeString("#vans");
    case "Dr-Martens":
      return new Handlebars.SafeString("#dr-martens");
    case "Nike":
      return new Handlebars.SafeString("#nike");
  }
});
Handlebars.registerHelper("displayColor", (color) => {
  let thisColor = color.split("-");
  return thisColor[0];
});
Handlebars.registerHelper("stockLevel", (colorname) => {
  return colorname + "-stock-level";
});
Handlebars.registerHelper("addThisShoe", (colorname) => {
  return colorname + "-add-btn";
});

//CSS RULES FOR STOCK COLORS
myShop["shoe"].forEach((thisShoe) => {
  rule = "." + thisShoe.colorname + "{ --mid: " + thisShoe.color + "}";
  document.styleSheets[0].insertRule(rule);
});

document.addEventListener("DOMContentLoaded", function () {
  let searchTemplateSource = document.querySelector("#searchTemplate").innerHTML;
  let searchTemplate = Handlebars.compile(searchTemplateSource);
  let search = document.querySelector(".search");
  search.innerHTML = searchTemplate(myShop);
  let stockTemplateSource = document.querySelector("#stockTemplate").innerHTML;
  let stockTemplate = Handlebars.compile(stockTemplateSource);
  let shoeStock = document.querySelector(".shoe-stock");
  shoeStock.innerHTML = stockTemplate(myShop);

  let cartTemplateSource = document.querySelector("#cartTemplate").innerHTML;
  let cartTemplate = Handlebars.compile(cartTemplateSource);
  let myCart = document.querySelector(".my-cart");
  if (myShop.cart) {
    myCart.innerHTML = cartTemplate(myShop.cart);
  } else {
    document.querySelector(".cart").classList.add("empty-cart");
  }

  let thisShoe = shoeShop();
  thisShoe.setStock(myShop["shoe"]);
  if (myShop.cart) {
    thisShoe.setCart(myShop.cart);
  }
  //SHOE CARD SIZE SELECTION
  const createSizeBtns = function () {
    let sizeInStock = document.querySelectorAll(".in-stock");
    let allStockLevels = document.querySelectorAll(".stock-level");
    sizeInStock.forEach((sizeBtn) => {
      sizeBtn.addEventListener("click", () => {
        sizeInStock.forEach((otherBtns) => {
          otherBtns.classList.remove("selected-size");
        });
        allStockLevels.forEach((stockLevel) => {
          stockLevel.innerHTML = "";
        });
        sizeBtn.classList.add("selected-size");

        thisShoe.setColor(sizeBtn.name);
        thisShoe.setSize(sizeBtn.value);
        stocklevelElem = sizeBtn.name + "-stock-level";
        if (thisShoe.stockLevel() == 0) {
          document.getElementById(stocklevelElem).innerHTML = "Out of stock!";
        } else {
          document.getElementById(stocklevelElem).innerHTML = thisShoe.stockLevel() + " left in stock";
        }
      });
    });
  };
  createSizeBtns();

  //ADD TO CART
  const createAddBtns = function () {
    let addToCart = document.querySelectorAll(".add-shoe");
    addToCart.forEach((addBtn) => {
      addBtn.addEventListener("click", () => {
        selectedShoe = thisShoe.getCurrentShoe();
        thisBtn = addBtn.id;
        thisStockMsgID = thisBtn.replace("add", "stock");
        thisStockMsgID = thisStockMsgID.replace("btn", "level");
        if (!thisBtn.startsWith(selectedShoe.colorname)) {
          document.getElementById(thisStockMsgID).innerHTML = "Please select a size.";
        } else {
          document.querySelector(".cart").classList.remove("empty-cart");
          checkoutBtn.classList.remove("empty-cart");
          clearCartBtn.classList.remove("empty-cart");
          myCart.innerHTML = cartTemplate(thisShoe.addToCart());
          document.querySelector(".total-cost").innerHTML = "Total: R" + thisShoe.getTotalCost();
          if (thisShoe.stockLevel() == 0) {
            document.getElementById(thisStockMsgID).innerHTML = "Out of stock!";
          } else {
            document.getElementById(thisStockMsgID).innerHTML = thisShoe.stockLevel() + " left in stock";
          }
          myShop.cart = thisShoe.getCart();
          localStorage.setItem("shopData", JSON.stringify(myShop));
        }
      });
    });
  };
  createAddBtns();

  let checkoutBtn = document.querySelector(".checkout");
  checkoutBtn.addEventListener("click", () => {
    delete myShop.cart;
    localStorage.setItem("shopData", JSON.stringify(myShop));
    myCart.innerHTML = "Thank you for shopping at Lubabalo's Shoe Emporium!";
    shoeStock.innerHTML = stockTemplate(myShop);
    createAddBtns();
    createSizeBtns();
    checkoutBtn.classList.add("empty-cart");
    clearCartBtn.classList.add("empty-cart");
    let newCart = {
      shoe: [],
    };
    thisShoe.setCart(newCart);
  });

  //CLEAR CART
  let clearCartBtn = document.querySelector(".clear-cart");
  clearCartBtn.addEventListener("click", () => {
    thisShoe.returnToStock();
    delete myShop.cart;
    localStorage.setItem("shopData", JSON.stringify(myShop));
    myCart.innerHTML = "Cart successfully emptied!";
    shoeStock.innerHTML = stockTemplate(myShop);
    createAddBtns();
    createSizeBtns();
    checkoutBtn.classList.add("empty-cart");
    clearCartBtn.classList.add("empty-cart");
  });

  //FILTER
  const filterBtn = document.querySelector(".filter");
  filterBtn.addEventListener("click", () => {
    const thisfilter = shoeFilter();
    const selectedBrands = document.querySelectorAll('input[name="brand"]:checked');
    const selectedSizes = document.querySelectorAll('input[name="size"]:checked');
    const selectedColors = document.querySelectorAll('input[name="color"]:checked');
    let brands = [];
    let sizes = [];
    let colors = [];
    selectedBrands.forEach((checkbox) => {
      brands.push(checkbox.value);
    });
    selectedSizes.forEach((checkbox) => {
      sizes.push(checkbox.value);
    });
    selectedColors.forEach((checkbox) => {
      colors.push(checkbox.value);
    });

    thisfilter.setStock(myShop.shoe);
    thisfilter.setValues(brands, sizes, colors);
    let matches = {};
    matches.shoe = thisfilter.getResults();
    shoeStock.innerHTML = stockTemplate(matches);
    if (matches["shoe"].length == 0) {
      shoeStock.innerHTML = "I'm sorry. We don't have any shoes that match that criteria.";
    }
    createSizeBtns();
    createAddBtns();
  });

  //FILTER RESET
  const clearFilterBtn = document.querySelector(".clear-filter");
  clearFilterBtn.addEventListener("click", () => {
    const brands = document.querySelectorAll('input[name="brand"]');
    const sizes = document.querySelectorAll('input[name="size"]');
    const colors = document.querySelectorAll('input[name="color"]');

    brands.forEach((checkbox) => {
      checkbox.checked = false;
    });
    sizes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    colors.forEach((checkbox) => {
      checkbox.checked = false;
    });
    shoeStock.innerHTML = stockTemplate(myShop);

    createSizeBtns();
    createAddBtns();
  });
});
