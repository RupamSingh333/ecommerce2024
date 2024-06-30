const express = require("express");
const bannerRoute = express();
const bodyParser = require("body-parser");
bannerRoute.use(express.static("public"));
bannerRoute.use(bodyParser.json());
bannerRoute.use(bodyParser.urlencoded({ extended: true }));
const helper = require("../utils/helper")
const auth = require("../middleware/auth");


const bannerController = require("../controllers/bannerController");

//contactUs Route
bannerRoute.post(
    "/add-banner",
    helper.uploadImage.single("image"), auth,
    bannerController.addBanner
);

module.exports = bannerRoute;