function shoeFilter() {
  let stock = {};
  let allBrands = {};
  let allSizes = {};
  let allColors = [];
  let searchBrands = [];
  let searchSizes = [];
  let searchColors = [];

  function setStock(thisStock) {
    stock = thisStock;
  }

  function setOptions(allShoes) {
    for (id in allShoes) {
      let shoe = allShoes[id];
      let sizes = Object.getOwnPropertyNames(shoe['stock']);
      let soldOut = function () {
        let x = true;
        sizes.forEach((size) => {
          if (shoe.stock[size] > 0) {
            x = false;
          }
        });
        return x;
      };
      let x = id.split('-');
      if (!allBrands[x[0]] && !soldOut()) {
        //let value = x[0];

        allBrands[x[0]] = shoe.brand;
      }
      if (!allColors.includes(shoe['color']['name']) && !soldOut()) {
        allColors.push(shoe['color']['name']);
      }

      sizes.forEach((size) => {
        if (shoe['stock'][size] > 0 && !allSizes[size]) {
          switch (size) {
            case 'three':
              allSizes[size] = 3;
              break;
            case 'four':
              allSizes[size] = 4;
              break;
            case 'five':
              allSizes[size] = 5;
              break;
            case 'six':
              allSizes[size] = 6;
              break;
            case 'seven':
              allSizes[size] = 7;
              break;
            case 'eight':
              allSizes[size] = 8;
              break;
            default:
              break;
          }
        }
      });
    }
  }

  function getAllBrands() {
    return allBrands;
  }

  function getAllColors() {
    return allColors;
  }

  function getAllSizes() {
    return allSizes;
  }

  function setCriteria(theseBrands, theseSizes, theseColors) {
    searchBrands = theseBrands;
    searchSizes = theseSizes;
    searchColors = theseColors;
  }

  function getResults() {
    let matches = Object.keys(stock);
    if (searchBrands.length > 0) {
      matches = matches.filter((product) => {
        return searchBrands.includes(stock[product]['brand']);
      });
    }
    if (searchColors.length > 0) {
      matches = matches.filter((product) => {
        return searchColors.includes(stock[product]['color']['name']);
      });
    }
    if (searchSizes.length > 0) {
      matches = matches.filter((product) => {
        let match = false;
        searchSizes.forEach((size) => {
          if (stock[product]['stock'][size] > 0) {
            match = true;
          }
        });
        return match;
      });
    }
    return matches;
  }

  return {
    setOptions,
    getAllBrands,
    getAllSizes,
    getAllColors,
    setStock,
    setCriteria,
    getResults,
  };
}

function shoeShop() {
  let color = '';
  let size = '';
  let stock = {};
  let cart = {
    shoe: [],
  };
  let currentShoe = {};

  function stockCheck(productID, size) {
    if (stock.hasOwnProperty(productID) && stock[productID]['stock'][size] > 0) {
      return 'in-stock';
    } else {
      return 'out-of-stock';
    }
  }

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

  function stockLevel(product, size) {
    return stock[product]['stock'][size];
  }

  function getCurrentShoe() {
    return currentShoe;
  }

  function addToCart() {
    let newShoe = true;
    if (stockLevel() > 0) {
      cart['shoe'].forEach((shoe) => {
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
        cart['shoe'].push(thisShoe);
        updateStock();
      }
    }
    return cart;
  }

  function getTotalCost() {
    let totalCost = 0;
    cart['shoe'].forEach((shoe) => {
      totalCost += shoe.price * shoe.qty;
    });
    cart.total = totalCost;
    return totalCost;
  }

  function updateStock() {
    stock.forEach((shoe) => {
      if (shoe.colorname == color) {
        shoe['stock'][size]--;
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
    while (cart['shoe'].length > 0) {
      cartShoe = cart['shoe'][0];
      stock.forEach((shoe) => {
        if (shoe.colorname == cartShoe.colorname) {
          shoe['stock'][cartShoe.size] += cartShoe.qty;
          cart.shoe.shift();
        }
      });
    }
    cart.total = 0;
  }

  function getQty() {
    let qty = '';
    console.log(color, size);
    cart['shoe'].forEach((shoe) => {
      if (currentShoe.colorname == shoe.colorname && size == shoe.size) {
        console.log(shoe.qty);
        console.log(shoe['qty'].toString());
        qty = shoe['qty'].toString();
      }
    });
    return qty;
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
    getQty,
    stockCheck,
  };
}
