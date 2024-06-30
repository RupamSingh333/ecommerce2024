const express = require("express");
const categoryRoute = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
categoryRoute.use(express.static("public"));
categoryRoute.use(bodyParser.json());
categoryRoute.use(bodyParser.urlencoded({ extended: true }));

const https = require("https");
const { generateSignature } = require("paytmchecksum"); // Import generateSignature function from paytmchecksum

// Define the route handler for checking payment status
categoryRoute.post("/check-payment-status", async (req, res) => {
  try {
    const { orderId } = req.body;

    // Construct Paytm request parameters
    const paytmParams = {
      body: {
        mid: "qAFlfw37151996972917",
        orderId: orderId,
        channelId:"WEB"
      },
    };

    // Generate checksum using paytmchecksum library
    const checksum = await generateSignature(
      JSON.stringify(paytmParams.body),
      "dn8oWwQGj7griWhX"
    ); // Replace with your Paytm Merchant Key

    paytmParams.head = {
      signature: checksum,
    };

    // Prepare JSON string for request
    const post_data = JSON.stringify(paytmParams);

    const options = {
      hostname: "securegw-stage.paytm.in", // Use staging URL for testing
      port: 443,
      path: "/v3/order/status",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    // Set up HTTPS request
    const post_req = https.request(options, function (post_res) {
      let response = "";

      post_res.on("data", function (chunk) {
        response += chunk;
      });

      post_res.on("end", function () {
        console.log("Response: ", response);
        res.status(200).json(JSON.parse(response)); // Send the Paytm API response back to the client
      });
    });

    // Handle HTTPS request errors
    post_req.on("error", function (err) {
      console.error("Error: ", err);
      res.status(500).send("Error");
    });

    // Send the JSON data in the request body
    post_req.write(post_data);
    post_req.end();
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send("Error");
  }
});

const categoryController = require("../controllers/categoryController");
//Create Category Route
categoryRoute.post("/create-category", auth, categoryController.createCategory);

//View All Category
categoryRoute.get("/view-category", categoryController.viewCategory);

//Update Category
categoryRoute.post("/update-category", auth, categoryController.updateCategory);

//Delete Category
categoryRoute.get("/delete-category", auth, categoryController.deleteCategory);

module.exports = categoryRoute;
