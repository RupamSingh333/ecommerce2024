const express = require("express");
const cartRoute = express();
const bodyParser = require("body-parser");
cartRoute.use(express.static("public"));
cartRoute.use(bodyParser.json());
cartRoute.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");


const cartController = require("../controllers/cartController");

//Add To Cart Route
cartRoute.post(
    "/add-to-cart", auth,
    cartController.addToCart
);

//Get Cart item Route
cartRoute.get(
    "/get-cart-items", auth,
    cartController.getCartItemsCount
);

//Delete Cart item Route
cartRoute.get(
    "/delete-cart-item", auth,
    cartController.deleteCartItem
);

//Get Cart item Details Route
cartRoute.post(
    "/get-cart-item-details", auth,
    cartController.getCartItemDetails
);

//Decrease Cart item Route
cartRoute.get(
    "/decrease-cart-item", auth,
    cartController.decreaseCartItem
);

//Clear Cart Route
cartRoute.get(
    "/clear-cart", auth,
    cartController.clearCart
)

module.exports = cartRoute;