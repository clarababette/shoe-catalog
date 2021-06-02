document.addEventListener("DOMContentLoaded", function () {
  let myStock = {};
  if (localStorage["shopData"]) {
    myStock = JSON.parse(localStorage.getItem("shopData"));
  } else {
    myStock = shoeData;
  }

  if (localStorage["customerCart"]) {
    localStorage.removeItem("customerCart");
  }

  const updateMyStock = stockUpdate();
  updateMyStock.setStock(myStock);

  Handlebars.registerHelper("viewBox", (brand) => {
    switch (brand) {
      case "Crocs":
        return new Handlebars.SafeString("'-5 0 522 380'");
      case "Converse":
        return new Handlebars.SafeString("'-5 10 522 400'");
      case "Vans":
        return new Handlebars.SafeString("'-5 0 522 380'");
      case "Dr Martens":
        return new Handlebars.SafeString("'0 0 522 512'");
      case "Nike":
        return new Handlebars.SafeString("'-5 0 522 380'");
    }
  });

  //CSS RULES FOR STOCK COLORS
  for (productID in myStock) {
    rule =
      "." +
      productID +
      " { --mid: " +
      myStock[productID]["color"]["value"] +
      "}";
    document.styleSheets[0].insertRule(rule);
  }

  let updateTemplateSource =
    document.querySelector("#updateTemplate").innerHTML;
  let updateTemplate = Handlebars.compile(updateTemplateSource);
  let products = document.querySelector(".products");
  let shoes = [];
  for (id in myStock) {
    let shoe = myStock[id];
    shoe["productID"] = id;
    shoes.push(shoe);
  }
  let productStock = {};
  productStock.shoes = shoes;
  products.innerHTML = updateTemplate(productStock);

  //INSERT SVG CODE
  for (productID in myStock) {
    document.querySelector("." + productID).innerHTML = document.getElementById(
      productID.split("-")[0]
    ).innerHTML;
    if (updateMyStock.soldOut(productID)) {
      document.getElementById(productID).classList.add("sold-out");
    }
  }

  let newShoeBtn = document.querySelector(".new-product");

  newShoeBtn.addEventListener("click", () => {
    document.querySelector(".new-shoe").classList.toggle("dont-display");
    document.querySelector(".products").classList.toggle("dont-display");
  });

  products.addEventListener("click", (click) => {
    let updateBtn = undefined;
    let saveBtn = undefined;
    let removeBtn = undefined;
    let productID = click.target.parentElement.id;

    if (click.target.classList.contains("update-btn")) {
      updateBtn = click.target;
    }
    if (click.target.classList.contains("save-btn")) {
      saveBtn = click.target;
    }
    if (click.target.classList.contains("remove-btn")) {
      removeBtn = click.target;
    }

    if (updateBtn) {
      document
        .querySelector("#" + productID + " .save-btn")
        .classList.remove("dont-display");
      updateBtn.classList.add("dont-display");
      let inputs = document.querySelectorAll("#" + productID + " input");
      inputs.forEach((field) => {
        field.setAttribute("type", "number");
        field.setAttribute("placeholder", field.nextSibling.innerHTML);
        field.nextSibling.innerHTML = "";
      });
    }
    if (saveBtn) {
      document
        .querySelector("#" + productID + " .update-btn")
        .classList.remove("dont-display");
      saveBtn.classList.add("dont-display");
      let inputs = document.querySelectorAll("#" + productID + " input");
      inputs.forEach((field) => {
        if (field.value != "") {
          if (field.name == "price") {
            updateMyStock.setPrice(productID, field.value);
          } else {
            updateMyStock.setQtyInStock(productID, field.name, field.value);
          }
        }
        field.setAttribute("type", "hidden");
        if (field.name == "price") {
          field.nextSibling.innerHTML = updateMyStock.getPrice(productID);
        } else {
          field.nextSibling.innerHTML = updateMyStock.getQtyInStock(
            productID,
            field.name
          );
        }
      });
      localStorage.setItem(
        "shopData",
        JSON.stringify(updateMyStock.getStock())
      );
      if (updateMyStock.soldOut(productID)) {
        document.getElementById(productID).classList.add("sold-out");
      } else {
        document.getElementById(productID).classList.remove("sold-out");
      }
    }

    if (removeBtn) {
      let confirm = document.querySelector(".confirm");
      let proceed = document.querySelector(".proceed");
      let cancel = document.querySelector(".cancel");
      confirm.classList.remove("dont-display");
      proceed.addEventListener("click", () => {
        updateMyStock.removeProduct(productID);
        removeBtn.parentElement.remove();
        confirm.classList.add("dont-display");
        localStorage.setItem(
          "shopData",
          JSON.stringify(updateMyStock.getStock())
        );
      });
      cancel.addEventListener("click", () => {
        confirm.classList.add("dont-display");
      });
    }
  });
}); //DOM CONTENT LOADED CLOSE
