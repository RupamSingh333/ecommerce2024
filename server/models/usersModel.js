const mongoose = require("mongoose");

const Users = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    masterPassword: {
      type: String,
      default: null,
    },
    avtar: {
      type: String,
      // required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "N",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", Users);
