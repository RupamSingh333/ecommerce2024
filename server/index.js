const express = require('express');
require('dotenv').config()
const config = require("./config/config");
const App = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'http://localhost';
App.use(express.static("public"));

// testing

//Allow request from all origins
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
};
App.use(cors(corsOptions));

//User Route
const userRoute = require("./routes/usersRoute");
App.use("/api", userRoute);

//Category Route
const categoryRoute = require("./routes/categoryRoute");
App.use("/api", categoryRoute);

//Sub Category Route
const SubCategoryRoute = require("./routes/subCategoryRoute");
App.use("/api", SubCategoryRoute);

//Company Route
const companyRoute = require("./routes/companyRoute");
App.use("/api", companyRoute);

//Product Route
const productRoute = require("./routes/productRoute");
App.use("/api", productRoute);

//Contact Route
const contactRoute = require("./routes/contactRoute");
App.use("/api", contactRoute);

//Banner Route
const bannerRoute = require("./routes/bannerRoute");
App.use("/api", bannerRoute);

// Cart Route
const cartRoute = require("./routes/cartRoute");
App.use("/api", cartRoute);

// Order Route
const orderRoute = require("./routes/orderRoute");
App.use("/api", orderRoute);


App.get('/', function (req, res) {
  res.send('Hello World')
});

App.get('*', function (req, res) {
  res.status(404).send({ success: false, message: "404 not found" })
});

const serverStart = async () => {
  try {
    await config.connectDB();
    App.listen(PORT, () => {
      console.log(`Server is listen on link ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

serverStart();
