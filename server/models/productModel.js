const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: [4, "Product Name should have more than 4 characters"],
        maxLength: [30, "Product Name cannot exceed 30 characters"],
    }, price: {
        type: Number,
        require: true
    }, image: {
        type: Array,
        // require: true
    }, description: {
        type: String,
        require: true
    }, categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    }, subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        default: null
    }, companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        default: null
    }, status: {
        type: String,
        enum: ["Y", "N"],
        default: "Y",
    }
},
    { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);