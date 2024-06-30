const Category = require("../models/categoryModel");
const helper = require("../utils/helper");
const { ObjectId } = require("mongodb");

module.exports.createCategory = async (req, res) => {
    try {
        const categoryName = await helper.capitalizeName(req.body.name);
        if (!categoryName) {
            res.status(400).send({ success: false, message: "Please Enter a Valid Name" });
            return false;
        };
        const categoryExist = await Category.findOne({ name: categoryName });
        if (categoryExist) {
            res.status(400).send({ success: false, message: "Category Already Exist" });
        } else {
            const createCategory = new Category({
                name: categoryName
            });
            const saveCategory = await createCategory.save();
            res.status(200).send({ success: true, message: "Category create successfully" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.viewCategory = async (req, res) => {
    try {
        const Id = req.query._id;
        if (Id) {
            const viewCategory = await Category.findOne({ _id: new ObjectId(Id) }, { _id: 1, name: 1, status: 1 });
            if (viewCategory) {
                res.status(200).send({ success: true, message: "Category viewed successfully", data: viewCategory });
            } else {
                res.status(400).send({ success: false, message: "Invalid Id" });
            }
        }
        else {
            const viewAllCategory = await Category.find({}, { _id: 1, name: 1, status: 1 });
            res.status(200).send({ success: true, message: "All Category successfully viewed", data: viewAllCategory });
        };
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.updateCategory = async (req, res) => {
    try {
        const { _id, name, status } = req.body;
        const categoryExist = await Category.findOne({ _id });
        if (categoryExist) {
            var condition = {};
            if (name) {
                const firstLetter = name[0];
                if (isNaN(firstLetter)) {
                    condition.name = await helper.capitalizeName(name);
                } else {
                    res.status(400).send({ success: false, message: "Invalid Name" });
                }
            };
            if (status) {
                if (status == "Y" || status == "N") {
                    condition.status = status;
                } else {
                    res.status(400).send({ success: false, message: "Invalid status" });
                }
            };
            const updateCategory = await Category.updateOne({ _id }, { $set: condition });
            res.status(200).send({ success: true, message: "Update Successfully", data: condition })
        } else {
            res.status(400).send({ success: false, message: "Invalid id" });
        }

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.deleteCategory = async (req, res) => {
    try {
        const Id = req.query._id;
        if (Id) {
            const findCategory = await Category.findOne({ _id: new ObjectId(Id) });
            if (findCategory) {
                const deleteCategory = await Category.deleteOne({ _id: new ObjectId(Id) });
                res.status(200).send({ success: true, message: "Category delete successfully" });
            } else {
                res.status(400).send({ success: false, message: "Invalid Id" });
            }
        }
        else {
            const deleteAllCategory = await Category.deleteMany({});
            res.status(200).send({ success: true, message: "All Category successfully deleted" });
        };
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};







