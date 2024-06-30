const express = require("express");
const orderRoute = express();
const bodyParser = require("body-parser");
orderRoute.use(express.static("public"));
orderRoute.use(bodyParser.json());
orderRoute.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");


const orderController = require("../controllers/orderController");

//Create Order Route
orderRoute.post(
    "/create-checkout-session", auth,
    orderController.createOrder
);

//Change Order Status
orderRoute.get(
    "/change-order-status", auth,
    orderController.changeOrderStatus
);

//View Order
orderRoute.get(
    "/view-order", auth,
    orderController.viewOrder
);

//View All Order
orderRoute.get(
    "/view-all-order", auth,
    orderController.viewAllOrder
)

//Delete Order
orderRoute.get(
    "/delete-order", auth,
    orderController.deleteOrder
)

module.exports = orderRoute;