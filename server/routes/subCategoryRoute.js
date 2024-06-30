const express = require("express");
const subCategoryRoute = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
subCategoryRoute.use(express.static("public"));
subCategoryRoute.use(bodyParser.json());
subCategoryRoute.use(bodyParser.urlencoded({ extended: true }));

const SubCategoryController = require("../controllers/subCategoryController");
//Create SubCategory Route
subCategoryRoute.post(
    "/create-subcategory",
    auth,
    SubCategoryController.createSubCategory
);
//View All SubCategory
subCategoryRoute.get("/view-subcategory", auth, SubCategoryController.viewSubCategory);

//Update SubCategory
subCategoryRoute.post("/update-subcategory", auth, SubCategoryController.updateSubCategory);

//Delete All SubCategory
subCategoryRoute.get("/delete-subcategory", auth, SubCategoryController.deleteSubCategory);

module.exports = subCategoryRoute;