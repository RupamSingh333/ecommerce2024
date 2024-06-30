const express = require("express");
const productRoute = express();
const bodyParser = require("body-parser");
const helper = require("../utils/helper")
const auth = require("../middleware/auth");
productRoute.use(express.static("public"));
productRoute.use(bodyParser.json());
productRoute.use(bodyParser.urlencoded({ extended: true }));

const productController = require("../controllers/productController");
//Create Product Route
productRoute.post(
    "/create-product", helper.uploadImage.array("image", 10),
    auth,
    productController.createProduct
);

//View Product
productRoute.get("/view-product", productController.viewProduct);

//Update Product
productRoute.post("/update-product", helper.uploadImage.array("image", 10),
    auth, productController.updateProduct);

//Delete Product
productRoute.get("/delete-product", auth, productController.deleteProduct);

//Search Product
productRoute.get("/search-product", productController.searchProduct);

module.exports = productRoute;