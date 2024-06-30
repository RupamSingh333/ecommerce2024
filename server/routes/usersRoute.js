const express = require("express");
const userRoute = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const helper = require("../utils/helper");
userRoute.use(express.static("public"));
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));


const userController = require("../controllers/usersController");

//register api
userRoute.post(
  "/register-user",
  helper.uploadImage.single("avtar"),
  userController.registerUser
);

//login api
userRoute.post(
  "/login-user",
  userController.loginUser
);

//User profile api
userRoute.post(
  "/user-profile",
  auth,
  userController.userProfile
);

//Update profile api
userRoute.post(
  "/update-profile",
  auth, helper.uploadImage.single("avtar"),
  userController.updateProfile
);

//delete user api
userRoute.get(
  "/delete-user",
  auth,
  userController.deleteUser
);

//delete all user api
userRoute.get(
  "/delete-all-user",
  auth,
  userController.deleteAllUser
);

//view all user api
userRoute.get(
  "/view-all-user",
  auth,
  userController.viewAllUser
);

//verify email api
userRoute.get(
  "/verify-email",
  userController.verifyEmail
);

//password update api
userRoute.post(
  "/update-password",
  auth,
  userController.updatePassword
);

//Update master password
userRoute.post("/update-master-password",
  auth,
  userController.updateMasterPassword);

//Change Status
userRoute.get(
  "/change-status",
  auth,
  userController.changeStatus
);



module.exports = userRoute;