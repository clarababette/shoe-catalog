function shoeFilter() {
  let stock = [];
  let brands = [];
  let sizes = [];
  let colors = [];

  function setStock(thisStock) {
    stock = thisStock;
  }

  function setValues(theseBrands, theseSizes, theseColors) {
    brands = theseBrands;
    sizes = theseSizes;

    colors = theseColors;
  }

  function brandMatches(searchList) {
    if (brands.length == 0) {
      return searchList;
    } else {
      let matches = [];
      brands.forEach((brand) => {
        searchList.forEach((shoe) => {
          if (shoe.brand == brand) {
            matches.push(shoe);
          }
        });
      });
      return matches;
    }
  }

  function sizeMatches(searchList) {
    if (sizes.length == 0) {
      return searchList;
    } else {
      let matches = [];
      sizes.forEach((size) => {
        searchList.forEach((shoe) => {
          if (shoe.stock[size] > 0) {
            matches.push(shoe);
          }
        });
      });
      return matches;
    }
  }

  function colorMatches(searchList) {
    if (colors.length == 0) {
      return searchList;
    } else {
      let matches = [];
      colors.forEach((color) => {
        searchList.forEach((shoe) => {
          if (shoe.colorname.startsWith(color)) {
            matches.push(shoe);
          }
        });
      });
      return matches;
    }
  }

  function getResults() {
    let matchList = stock;
    matchList = brandMatches(matchList);
    matchList = sizeMatches(matchList);
    matchList = colorMatches(matchList);
    return matchList;
  }

  return {
    setStock,
    setValues,
    getResults,
    brandMatches,
  };
}

function shoeShop() {
  let color = "";
  let size = "";
  let stock = [];
  let cart = {
    shoe: [],
  };
  let currentShoe = {};

  function setStock(currentStock) {
    stock = currentStock;
  }

  function setColor(shoeColor) {
    color = shoeColor;
  }

  function setSize(shoeSize) {
    size = shoeSize;
  }

  function setCart(currentCart) {
    cart = currentCart;
  }

  function stockLevel() {
    let stockNum = 0;
    stock.forEach((shoe) => {
      if (shoe.colorname == color) {
        stockNum = shoe["stock"][size];
        currentShoe = shoe;
      }
    });
    return stockNum;
  }

  function getCurrentShoe() {
    return currentShoe;
  }

  function addToCart() {
    let newShoe = true;
    if (stockLevel() > 0) {
      cart["shoe"].forEach((shoe) => {
        if (currentShoe.colorname == shoe.colorname && size == shoe.size) {
          shoe.qty++;
          newShoe = false;
          updateStock();
        }
      });

      if (newShoe) {
        thisShoe = {};
        thisShoe.brand = currentShoe.brand;
        thisShoe.colorname = currentShoe.colorname;
        thisShoe.price = currentShoe.price;
        thisShoe.qty = 1;
        thisShoe.size = size;
        cart["shoe"].push(thisShoe);
        updateStock();
      }
    }
    return cart;
  }

  function getTotalCost() {
    let totalCost = 0;
    cart["shoe"].forEach((shoe) => {
      totalCost += shoe.price * shoe.qty;
    });
    cart.total = totalCost;
    return totalCost;
  }

  function updateStock() {
    stock.forEach((shoe) => {
      if (shoe.colorname == color) {
        shoe["stock"][size]--;
      }
    });
  }

  function getStock() {
    return stock;
  }

  function getCart() {
    return cart;
  }

  function returnToStock() {
    while (cart["shoe"].length > 0) {
      cartShoe = cart["shoe"][0];
      stock.forEach((shoe) => {
        if (shoe.colorname == cartShoe.colorname) {
          shoe["stock"][cartShoe.size] += cartShoe.qty;
          cart.shoe.shift();
        }
      });
    }
    cart.total = 0;
  }

  return {
    setStock,
    setColor,
    setSize,
    setCart,
    stockLevel,
    addToCart,
    getCurrentShoe,
    getTotalCost,
    getStock,
    updateStock,
    getCart,
    returnToStock,
  };
}
