const mongoose = require("mongoose");
const Banner = mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 20,
    }, image: {
        type: String,
        require: true
    }, status: {
        type: String,
        enum: ["Y", "N"],
        default: "Y",
    }
},
    { timestamps: true });

module.exports = mongoose.model("Banner", Banner);