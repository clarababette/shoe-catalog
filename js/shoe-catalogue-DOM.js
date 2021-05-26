//CSS RULES FOR STOCK COLORS
for (productID in myStock) {
  rule = '.' + productID + ' { --mid: ' + myStock[productID]['color']['value'] + '}';
  document.styleSheets[0].insertRule(rule);
}
document.addEventListener('DOMContentLoaded', function () {
  //GET SHOP DATA
  let myStock = {};
  let myCart = undefined;
  if (localStorage['shopData']) {
    myStock = JSON.parse(localStorage.getItem('shopData'));
  } else {
    myStock = shoeData;
  }
  if (localStorage['customerCart']) {
    myCart = JSON.parse(localStorage.getItem('customerCart'));
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
        return new Handlebars.SafeString('#drmartens');
      case 'Nike':
        return new Handlebars.SafeString('#nike');
    }
  });

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
  for (productID in myStock) {
    document.querySelector('.' + productID).innerHTML = document.getElementById(productID.split('-')[0]).innerHTML;
  }

  //document.querySelector('.crocs-blue').innerHTML = document.getElementById('crocs').innerHTML;

  //CART TEMPLATE
  let cartTemplateSource = document.querySelector('#cartTemplate').innerHTML;
  let cartTemplate = Handlebars.compile(cartTemplateSource);
  let cart = document.querySelector('.my-cart');
  if (myCart) {
    let items = [];
    for (id in myCart) {
      let item = myCart[id];
      item['itemID'] = id;
      items.push(item);
    }
    let cartItems = {};
    cartItems.items = items;
    cart.innerHTML = cartTemplate(cartItems);
    myShop.setCart(myCart);
  } else {
    document.querySelector('.cart').classList.add('empty-cart');
  }

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

  const shoesAvailable = document.querySelector('.shoe-stock');
  shoesAvailable.addEventListener('click', (click) => {
    let sizeBtn = undefined;
    let addBtn = undefined;

    if (click.target.classList.contains('in-stock')) {
      sizeBtn = click.target;
    }
    if (click.target.classList.contains('add-shoe')) {
      addBtn = click.target;
    }

    if (sizeBtn) {
      let sizeInStock = document.querySelectorAll('#' + sizeBtn.name + ' .in-stock');
      sizeInStock.forEach((otherBtns) => {
        otherBtns.classList.remove('selected-size');
      });
      sizeBtn.classList.add('selected-size');
      productID = sizeBtn.name;
      itemID = sizeBtn.name + '-' + sizeBtn.value;

      let qtyInStock = myShop.stockLevel(productID, sizeBtn.value);

      if (qtyInStock == 0) {
        document.querySelector('#' + productID + ' .stock-level').innerHTML = 'Out of stock!';
      } else {
        document.querySelector('#' + productID + ' .stock-level').innerHTML = qtyInStock + ' left in stock';
      }
    }

    if (addBtn) {
      let productID = addBtn.parentElement.parentElement.id;
      let selectedSize = document.querySelector('#' + productID + ' .selected-size');

      if (selectedSize == null) {
        document.querySelector('#' + productID + ' .stock-level').innerHTML = 'Please select a size.';
      } else {
        let itemID = productID + '-' + selectedSize.value;
        let cart = myShop.addToCart(productID, itemID);
        let cartItemElem = document.getElementById(itemID);
        document.querySelector('.cart').classList.remove('empty-cart');
        if (cartItemElem === null) {
          newCartItem(itemID);
          document.querySelector('#' + itemID + ' .cart-brand').innerHTML = cart[itemID]['brand'];
          document.querySelector('#' + itemID + ' .cart-color').innerHTML = cart[itemID]['color'];
          document.querySelector('#' + itemID + ' .cart-size').innerHTML = 'Size: ' + selectedSize.innerHTML;
          document.querySelector('#' + itemID + ' .cart-qty').innerHTML = 'Qty: ' + cart[itemID]['qty'];
          document.querySelector('#' + itemID + ' .cart-price').innerHTML = 'R' + cart[itemID]['unitPrice'] * cart[itemID]['qty'];
          cart[itemID]['size'] = selectedSize.innerHTML;
          cart[itemID]['subTotal'] = cart[itemID]['unitPrice'] * cart[itemID]['qty'];
        } else {
          document.querySelector('#' + itemID + ' .cart-qty').innerHTML = 'Qty: ' + cart[itemID]['qty'];
          document.querySelector('#' + itemID + ' .cart-price').innerHTML = 'R' + cart[itemID]['unitPrice'] * cart[itemID]['qty'];
          cart[itemID]['subTotal'] = cart[itemID]['unitPrice'] * cart[itemID]['qty'];
        }
        document.querySelector('.total-cost').innerHTML = 'Total: R' + myShop.getTotalCost();
        stockIndicator(productID, selectedSize);
        localStorage.setItem('shopData', JSON.stringify(myShop.getStock()));
        localStorage.setItem('customerCart', JSON.stringify(myShop.getCart()));
      }
    }
  });

  const stockIndicator = (productID, selectedSize) => {
    let qtyInStock = myShop.stockLevel(productID, selectedSize.value);
    if (qtyInStock == 0) {
      document.querySelector('#' + productID + ' .stock-level').innerHTML = '';

      selectedSize.classList.remove('selected-size');
      selectedSize.classList.remove('in-stock');
      selectedSize.classList.add('out-of-stock');
    } else {
      selectedSize.classList.add('selected-size');
      selectedSize.classList.add('in-stock');
      selectedSize.classList.remove('out-of-stock');
      document.querySelector('#' + productID + ' .stock-level').innerHTML = qtyInStock + ' left in stock';
    }
  };

  const newCartItem = (itemID) => {
    let cartItem = document.createElement('div');
    cartItem.id = itemID;
    cartItem.classList.add('in-cart');
    let fields = ['cart-brand', 'cart-color', 'cart-size', 'cart-qty', 'cart-price'];
    fields.forEach((field) => {
      let elem = document.createElement('div');
      elem.classList.add(field);
      cartItem.appendChild(elem);
    });
    let incBtn = document.createElement('button');
    incBtn.classList.add('increase-qty');
    incBtn.innerHTML = '+';
    cartItem.appendChild(incBtn);
    let decrBtn = document.createElement('button');
    decrBtn.classList.add('decrease-qty');
    decrBtn.innerHTML = '—';
    cartItem.appendChild(decrBtn);
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-item');
    deleteBtn.innerHTML = 'x';
    cartItem.appendChild(deleteBtn);
    document.querySelector('.my-cart').appendChild(cartItem);
  };

  const cartElem = document.querySelector('.cart');
  cartElem.addEventListener('click', (click) => {
    let incBtn = undefined;
    let decrBtn = undefined;
    let deleteBtn = undefined;
    let checkOutBtn = undefined;
    let clearCartBtn = undefined;
    if (click.target.classList.contains('increase-qty')) {
      incBtn = click.target;
    }
    if (click.target.classList.contains('decrease-qty')) {
      decrBtn = click.target;
    }
    if (click.target.classList.contains('delete-item')) {
      deleteBtn = click.target;
    }
    if (click.target.classList.contains('checkout')) {
      checkOutBtn = click.target;
    }
    if (click.target.classList.contains('clear-cart')) {
      clearCartBtn = click.target;
    }

    if (incBtn || decrBtn || deleteBtn) {
      let cartItem = click.target.parentElement;
      let itemID = cartItem.id;
      let productID = myShop.getProductFromItem(itemID);
      let size = myShop.getSizeFromItem(itemID);
      let sizeBtn = document.querySelector('#' + productID + ' [value="' + size + '"]');
      let cart = myShop.getCart();

      if (incBtn) {
        cart = myShop.addToCart(productID, itemID);
      }
      if (decrBtn) {
        cart = myShop.returnItems(itemID, 1);
      }
      if (deleteBtn) {
        cart = myShop.returnItems(itemID, cart[itemID]['qty']);
      }

      if (cart[itemID]) {
        document.querySelector('#' + itemID + ' .cart-qty').innerHTML = 'Qty: ' + cart[itemID]['qty'];
        document.querySelector('#' + itemID + ' .cart-price').innerHTML = 'R' + cart[itemID]['unitPrice'] * cart[itemID]['qty'];
        cart[itemID]['subTotal'] = cart[itemID]['unitPrice'] * cart[itemID]['qty'];
      } else {
        cartItem.remove();
      }
      console.log(myShop.getCart());
      if (Object.entries(myShop.getCart()).length == 0) {
        document.querySelector('.total-cost').innerHTML = 'is empty!';
      } else {
        document.querySelector('.total-cost').innerHTML = 'Total: R' + myShop.getTotalCost();
      }

      let qtyInStock = myShop.stockLevel(productID, size);
      if (qtyInStock == 0) {
        sizeBtn.classList.remove('in-stock');
        sizeBtn.classList.add('out-of-stock');
      } else {
        sizeBtn.classList.add('in-stock');
        sizeBtn.classList.remove('out-of-stock');
      }

      if (sizeBtn.classList.contains('selected-size')) {
        sizeBtn.classList.remove('selected-size');
        document.querySelector('#' + productID + ' .stock-level').innerHTML = '';
      }
      localStorage.setItem('shopData', JSON.stringify(myShop.getStock()));
      localStorage.setItem('customerCart', JSON.stringify(myShop.getCart()));
    }
    //CHECK-OUT CART
    if (checkOutBtn) {
      localStorage.removeItem('customerCart');
      localStorage.setItem('shopData', JSON.stringify(myShop.getStock()));
      myShop.setCart({});
      document.querySelector('.my-cart').innerHTML = '';
      checkOutBtn.classList.add('empty-cart');
      document.querySelector('.total-cost').innerHTML = "Thank you for shopping at Lubabalo's Shoe Emporium!";
    }

    if (clearCartBtn) {
      cart = myShop.getCart();
      for (itemID in cart) {
        myShop.returnItems(itemID, cart[itemID]['qty']);
      }
      console.log(myShop.getCart());
      document.querySelector('.my-cart').innerHTML = '';
      document.querySelector('.total-cost').innerHTML = 'Cart successfully cleared!';
      localStorage.removeItem('customerCart');
      localStorage.setItem('shopData', JSON.stringify(myShop.getStock()));
    }
  });

  // //FILTER - done
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

  // //FILTER RESET - done
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
