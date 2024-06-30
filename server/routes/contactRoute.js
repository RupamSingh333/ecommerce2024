const express = require("express");
const contactRoute = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
contactRoute.use(express.static("public"));
contactRoute.use(bodyParser.json());
contactRoute.use(bodyParser.urlencoded({ extended: true }));

const contactController = require("../controllers/contactController");

//contactUs Route
contactRoute.post(
    "/contact-us",
    contactController.contactUs
);

contactRoute.get(
    "/view-all-contact",
    auth,
    contactController.viewAllContact
);

contactRoute.get(
    "/delete-contact",
    auth,
    contactController.deleteContact
);

module.exports = contactRoute;