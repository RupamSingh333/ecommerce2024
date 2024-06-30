const express = require("express");
const companyRoute = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
companyRoute.use(express.static("public"));
companyRoute.use(bodyParser.json());
companyRoute.use(bodyParser.urlencoded({ extended: true }));

const companyController = require("../controllers/companyController");
//Create Company Route
companyRoute.post(
    "/create-company",
    auth,
    companyController.createCompany
);

//View All Company
companyRoute.get("/view-company", companyController.viewCompany);

//Update Company
companyRoute.post("/update-company", auth, companyController.updateCompany);

//Delete All Company
companyRoute.get("/delete-company", auth, companyController.deleteCompany);


module.exports = companyRoute;