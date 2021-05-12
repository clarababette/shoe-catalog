//dom add shoe-icon class and set viewbox

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
    case "Dr Martens":
      return new Handlebars.SafeString("'0 0 522 512'");
    case "Nike":
      return new Handlebars.SafeString("'-5 0 522 380'");
  }
});

Handlebars.registerHelper("icon", (brand) => {
  switch (brand) {
    case "Crocs":
      return new Handlebars.SafeString("#crocs");
    case "Converse":
      return new Handlebars.SafeString("#converse");
    case "Vans":
      return new Handlebars.SafeString("#vans");
    case "Dr Martens":
      return new Handlebars.SafeString("#dr-martens");
    case "Nike":
      return new Handlebars.SafeString("#nike");
  }
});

Handlebars.registerHelper("displayColor", (color) => {
  let thisColor = color.split("-");
  return thisColor[0];
});

let theseShoes = shoeData["shoe"];
theseShoes.forEach((thisShoe) => {
  rule = "." + thisShoe.colorname + "{ --mid: " + thisShoe.color + "}";

  document.styleSheets[0].insertRule(rule);
});

document.addEventListener("DOMContentLoaded", function () {
  let templateSource = document.querySelector("#searchTemplate").innerHTML;
  let searchTemplate = Handlebars.compile(templateSource);
  let search = document.querySelector(".search");
  search.innerHTML = searchTemplate(shoeData);
  templateSource = document.querySelector("#stockTemplate").innerHTML;
  let stockTemplate = Handlebars.compile(templateSource);
  let shoeStock = document.querySelector(".shoe-stock");
  shoeStock.innerHTML = stockTemplate(shoeData);
});
