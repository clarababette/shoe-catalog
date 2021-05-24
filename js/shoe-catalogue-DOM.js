//GET SHOP DATA
let myStock = {};
let myCart = {};
if (localStorage['shopData']) {
  myStock = JSON.parse(localStorage.getItem('shopData'));
} else {
  myStock = shoeData;
}

//Initialize shop
const myShop = shoeShop();
myShop.setStock(myStock);

//Initialize filter
const filter = shoeFilter();

//HANDLEBARS HELPERS
Handlebars.registerHelper('stockCheck', (productID, size) => {
  return myShop.stockCheck(productID, size);
});
Handlebars.registerHelper('viewBox', (brand) => {
  switch (brand) {
    case 'Crocs':
      return new Handlebars.SafeString("'-5 0 522 380'");
    case 'Converse':
      return new Handlebars.SafeString("'-5 10 522 400'");
    case 'Vans':
      return new Handlebars.SafeString("'-5 0 522 380'");
    case 'Dr Martens':
      return new Handlebars.SafeString("'0 0 522 512'");
    case 'Nike':
      return new Handlebars.SafeString("'-5 0 522 380'");
  }
});

Handlebars.registerHelper('icon', (brand) => {
  switch (brand) {
    case 'Crocs':
      return new Handlebars.SafeString('#crocs');
    case 'Converse':
      return new Handlebars.SafeString('#converse');
    case 'Vans':
      return new Handlebars.SafeString('#vans');
    case 'Dr Martens':
      return new Handlebars.SafeString('#dr-martens');
    case 'Nike':
      return new Handlebars.SafeString('#nike');
  }
});

//CSS RULES FOR STOCK COLORS
for (productID in myStock) {
  rule = '.' + productID + ' { --mid: ' + myStock[productID]['color']['value'] + '}';
  document.styleSheets[0].insertRule(rule);
}

document.addEventListener('DOMContentLoaded', function () {
  //SEARCH TEMPLATE
  // Create brand, size and color lists from what is in stock
  filter.setOptions(myStock);
  let filterOptions = {
    brands: filter.getAllBrands(),
    sizes: filter.getAllSizes(),
    colors: filter.getAllColors(),
  };

  let searchTemplateSource = document.querySelector('#searchTemplate').innerHTML;
  let searchTemplate = Handlebars.compile(searchTemplateSource);
  let search = document.querySelector('.search');
  search.innerHTML = searchTemplate(filterOptions);

  //STOCK TEMPLATE
  let stockTemplateSource = document.querySelector('#stockTemplate').innerHTML;
  let stockTemplate = Handlebars.compile(stockTemplateSource);
  let shoeStock = document.querySelector('.shoe-stock');
  let shoes = [];
  for (id in myStock) {
    let shoe = myStock[id];
    shoe['productID'] = id;
    shoes.push(shoe);
  }
  let shoeCards = {};
  shoeCards.shoes = shoes;
  console.log(shoeCards);
  shoeStock.innerHTML = stockTemplate(shoeCards);

  //CART TEMPLATE
  let cartTemplateSource = document.querySelector('#cartTemplate').innerHTML;
  let cartTemplate = Handlebars.compile(cartTemplateSource);
  let myCart = document.querySelector('.my-cart');
  if (myShop.cart) {
    myCart.innerHTML = cartTemplate(myShop.cart);
  } else {
    document.querySelector('.cart').classList.add('empty-cart');
  }

  let thisCustomer = shoeShop();
  thisCustomer.setStock(myShop['shoe']);
  if (myShop.cart) {
    thisCustomer.setCart(myShop.cart);
  }

  //SHOE CARD SIZE SELECTION

  let sizeInStock = document.querySelectorAll('.in-stock');
  let allStockLevels = document.querySelectorAll('.stock-level');
  sizeInStock.forEach((sizeBtn) => {
    sizeBtn.addEventListener('click', () => {
      sizeInStock.forEach((otherBtns) => {
        otherBtns.classList.remove('selected-size');
      });
      allStockLevels.forEach((stockLevel) => {
        stockLevel.innerHTML = '';
      });
      sizeBtn.classList.add('selected-size');
      let selectedProduct = sizeBtn.name;
      let selectedSize = sizeBtn.value;
      let qtyInStock = myShop.stockLevel(selectedProduct, selectedSize);

      if (qtyInStock == 0) {
        document.getElementById(stocklevelElem).innerHTML = 'Out of stock!';
      } else {
        document.getElementById(stocklevelElem).innerHTML = qtyInStock + ' left in stock';
      }
    });
  });

  //ADD TO CART
  const createAddBtns = function () {
    let addToCart = document.querySelectorAll('.add-shoe');
    addToCart.forEach((addBtn) => {
      addBtn.addEventListener('click', () => {
        selectedShoe = thisCustomer.getCurrentShoe();
        thisBtn = addBtn.id;
        thisStockMsgID = thisBtn.replace('add', 'stock');
        thisStockMsgID = thisStockMsgID.replace('btn', 'level');
        if (!thisBtn.startsWith(selectedShoe.colorname)) {
          document.getElementById(thisStockMsgID).innerHTML = 'Please select a size.';
        } else {
          document.querySelector('.cart').classList.remove('empty-cart');
          checkoutBtn.classList.remove('empty-cart');
          clearCartBtn.classList.remove('empty-cart');
          //FIX!!!

          let cart = thisCustomer.addToCart();
          let wawa = cart['shoe'];
          let newToCart = wawa[wawa.length - 1];
          console.log(cart);
          console.log(newToCart);

          const cloneMeCart = document.querySelector('.cart-clone');
          let clone = cloneMeCart.cloneNode(true);
          clone.classList.remove('cart-clone');
          let inCart = clone.children;
          let deleteBtn = inCart[0];
          let brand = inCart[1];
          let color = inCart[2];
          let size = inCart[3];
          let qty = inCart[4].children[0];
          let incQty = inCart[4].children[1];
          let decQty = inCart[4].children[2];
          let cartPrice = inCart[5];
          brand.innerHTML = newToCart.brand;
          color.innerHTML = newToCart.colorname;
          size.innerHTML = newToCart.size;
          qty.innerHTML = 'Qty: ' + newToCart.qty;
          cartPrice.innerHTML = 'R' + newToCart.price;
          document.querySelector('.my-cart').appendChild(clone);

          document.querySelector('.total-cost').innerHTML = 'Total: R' + thisCustomer.getTotalCost();
          if (thisCustomer.stockLevel() == 0) {
            document.getElementById(thisStockMsgID).innerHTML = 'Out of stock!';
          } else {
            document.getElementById(thisStockMsgID).innerHTML = thisCustomer.stockLevel() + ' left in stock';
          }
          myShop.cart = thisCustomer.getCart();
          localStorage.setItem('shopData', JSON.stringify(myShop));
        }
      });
    });
  };
  createAddBtns();

  //CHECK-OUT CART
  let checkoutBtn = document.querySelector('.checkout');
  checkoutBtn.addEventListener('click', () => {
    delete myShop.cart;
    localStorage.setItem('shopData', JSON.stringify(myShop));
    myCart.innerHTML = "Thank you for shopping at Lubabalo's Shoe Emporium!";
    //FIX!!!!
    shoeStock.innerHTML = stockTemplate(myShop);
    createAddBtns();
    createSizeBtns();
    checkoutBtn.classList.add('empty-cart');
    clearCartBtn.classList.add('empty-cart');
    let newCart = {
      shoe: [],
    };
    thisCustomer.setCart(newCart);
  });

  //INCREASE QTY IN CART
  const createIncBtn = function () {
    let incQtyBtn = document.querySelectorAll('.increase-qty');
    incQtyBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        let shoe = btn.value.split('|');
        thisCustomer.setColor(shoe[0]);
        thisCustomer.setSize(shoe[1]);
        thisCustomer.addToCart();
        btn.previousElementSibling.innerHTML = thisCustomer.getQty(btn.value);
        document.querySelector('.total-cost').innerHTML = 'Total: R' + thisCustomer.getTotalCost();
        myShop.cart = thisCustomer.getCart();
        localStorage.setItem('shopData', JSON.stringify(myShop));
      });
    });
  };
  createIncBtn();

  //CLEAR CART
  let clearCartBtn = document.querySelector('.clear-cart');
  clearCartBtn.addEventListener('click', () => {
    thisCustomer.returnToStock();
    delete myShop.cart;
    localStorage.setItem('shopData', JSON.stringify(myShop));
    myCart.innerHTML = 'Cart successfully emptied!';
    //FIX!!!
    shoeStock.innerHTML = stockTemplate(myShop);
    createAddBtns();
    createSizeBtns();
    checkoutBtn.classList.add('empty-cart');
    clearCartBtn.classList.add('empty-cart');
  });

  //FILTER - done
  const filterBtn = document.querySelector('.filter');
  filterBtn.addEventListener('click', () => {
    const selectedBrands = document.querySelectorAll('input[name="brand"]:checked');
    const selectedSizes = document.querySelectorAll('input[name="size"]:checked');
    const selectedColors = document.querySelectorAll('input[name="color"]:checked');
    let filterOptions = {
      brands: filter.getAllBrands(),
      sizes: filter.getAllSizes(),
      colors: filter.getAllColors(),
    };

    let brands = [];
    let sizes = [];
    let colors = [];
    selectedBrands.forEach((checkbox) => {
      brands.push(filterOptions.brands[checkbox.value]);
    });
    selectedSizes.forEach((checkbox) => {
      sizes.push(checkbox.value);
    });
    selectedColors.forEach((checkbox) => {
      colors.push(checkbox.value);
    });

    filter.setStock(myStock);
    filter.setCriteria(brands, sizes, colors);
    let matches = filter.getResults();
    console.log(matches);
    //FIX!!!!
    let shoeCards = document.querySelectorAll('.shoe-card');
    shoeCards.forEach((card) => {
      if (!matches.includes(card.id)) {
        card.style.display = 'none';
      } else {
        card.style.display = 'inline-flex';
      }
    });
  });

  //FILTER RESET - done
  const clearFilterBtn = document.querySelector('.clear-filter');
  clearFilterBtn.addEventListener('click', () => {
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
    let shoeCards = document.querySelectorAll('.shoe-card');
    shoeCards.forEach((card) => {
      card.style.display = 'inline-flex';
    });
  });
}); //DOM CONTENT LOADED CLOSE
