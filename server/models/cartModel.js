const mongoose = require("mongoose");
const Cart = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
},
    { timestamps: true });

module.exports = mongoose.model("Cart", Cart);