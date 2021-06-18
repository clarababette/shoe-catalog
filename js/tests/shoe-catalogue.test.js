describe('Testing the filter factory functions of the shoe catalog', () => {
  let filter = shoeFilter();
  filter.setStock(shoeData);
  filter.setOptions(shoeData);
  it('should be able to get a list of all the brands in stock', () => {
    let brands = {
      crocs: 'Crocs',
      converse: 'Converse',
      vans: 'Vans',
      drmartens: 'Dr Martens',
      nike: 'Nike',
    };
    assert.deepEqual(filter.getAllBrands(), brands);
  });
  it('should be able to get a list of all the colors in stock', () => {
    let colors = ['blue', 'red', 'green', 'pink', 'black', 'orange'];
    assert.deepEqual(filter.getAllColors(), colors);
  });
  it('should be able to get a list of all the sizes in stock', () => {
    let sizes = {
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
    };
    assert.deepEqual(filter.getAllSizes(), sizes);
  });
  it('should be able to return an object containing all the shoes that match the set criteria', () => {
    let brands = ['Crocs', 'Vans', 'Converse'];
    let colors = ['blue', 'green'];
    let sizes = ['four', 'seven', 'eight'];

    filter.setCriteria(brands, sizes, colors);
    assert.deepEqual(filter.getResults(), ['crocs-blue', 'converse-green', 'vans-blue']);
  });
});

describe('Testing the shop and cart factory functions of the shoe catalog', () => {
  let shop = shoeShop();
  shop.setStock(shoeData);
  it('should be able to check whether or not there is stock of a shoe', () => {
    assert.equal(shop.stockCheck('crocs-blue', 'three'), 'out-of-stock');
    assert.equal(shop.stockCheck('crocs-blue', 'five'), 'in-stock');
  });
  it('should be able to check whether or not all sizes of a shoe are sold out', () => {
    assert.equal(shop.soldOut('vans-pink'), false);
    assert.equal(shop.soldOut('drmartens-blue'), true);
  });
  it('should be able to return the number of shoes in a specific size left in stock', () => {
    assert.equal(shop.stockLevel('nike-blue', 'five'), 3);
  });
  it('should be able to add a shoe in the selected size to the cart', () => {
    shop.addToCart('nike-blue', 'nike-blue-six');
    assert.deepEqual(shop.getCart(), {
      'nike-blue-six': {
        brand: 'Nike',
        color: 'blue',
        unitPrice: 600,
        qty: 1,
      },
    });
  });
  it('should be able to remove a shoe in the selected size from the stock', () => {
    shop.addToCart('nike-blue', 'nike-blue-five');
    assert.equal(shop.stockLevel('nike-blue', 'five'), 2);
  });
  it('should be able to remove a shoe from the cart and return it to the stock', () => {
    shop.returnItems('nike-blue-five', 1);
    assert.equal(shop.stockLevel('nike-blue', 'five'), 3);
  });
  it('should be able to get the product ID from the itemID', () => {
    assert.equal(shop.getProductFromItem('crocs-red-seven'), 'crocs-red');
  });
  it('should be able to get the size from the itemID', () => {
    assert.equal(shop.getSizeFromItem('crocs-red-four'), 'four');
  });
  it('should be able to get the total cost of all items in the cart', () => {
    shop.addToCart('vans-pink', 'vans-pink-seven');
    shop.addToCart('drmartens-orange', 'drmartens-orange-six');
    assert.equal(shop.getTotalCost(), 1575);
  });
});

describe('Testing the stock update factory functions of the shoe catalog', () => {
  stock = stockUpdate();
  stock.setStock(shoeData);
  it('should be able to check whether or not all sizes of a shoe is sold out', () => {
    assert.equal(stock.soldOut('vans-pink'), false);
    assert.equal(stock.soldOut('drmartens-blue'), true);
  });
  it('should be able to change the quantity of a specific size currently from stock', () => {
    stock.setQtyInStock('converse-pink', 'four', 10);
    assert.equal(stock.getQtyInStock('converse-pink', 'four'), 10);
  });
  it('should be able to change the price of a product', () => {
    stock.setPrice('crocs-red', 237);
    assert.equal(stock.getPrice('crocs-red'), 237);
  });
  it('should be able to remove a product from the stock entirely', () => {
    stock.removeProduct('vans-pink');
    let myStock = stock.getStock();
    assert.equal(myStock['vans-pink'], undefined);
  });
  it('should be able to add new product to the stock', () => {
    stock.addNewProductID('crocs', 'brown');
    let myStock = stock.getStock();
    assert.equal(myStock.hasOwnProperty('crocs-brown'), true);
  });
});
