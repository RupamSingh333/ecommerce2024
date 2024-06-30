const Products = require("../models/productModel");
require('dotenv').config()
const helper = require("../utils/helper");
const randomstring = require("randomstring");
const path = require("path");
const fs = require("fs");
const { config } = require("process");
const { ObjectId } = require("mongodb");
const { log, count } = require("console");

const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const Company = require("../models/companyModel");

const fileURL = path.join(__dirname, `../public/uploads/`);


module.exports.createProduct = async (req, res) => {
    try {
        const name = await helper.capitalizeName(req.body.name);
        const { price, description, categoryId, subCategoryId, companyId } = req.body;
        // console.log(req.files);
        // return false;
        if (!name) {
            res.status(400).send({ success: false, message: "Please Enter a Valid Name" });
            return false;
        };
        if (!price) {
            res.status(400).send({ success: false, message: "Please Enter a price" });
            return false;
        };
        if (!description) {
            res.status(400).send({ success: false, message: "Please Enter description" });
            return false;
        };
        const productExist = await Products.findOne({ name });
        if (productExist) {
            if (req.files) {
                req.files.map(
                    (fileData) => {
                        fs.unlinkSync(fileData.path);
                    }
                )
            }
            res.status(400).send({ success: false, message: "Product Already Exist" });
        } else {
            const createProduct = new Products({
                name: name,
                price: price,
                description: description,
                categoryId: categoryId,
                // subCategoryId: subCategoryId,
                companyId: companyId
            });

            if (req.files) {
                const fileData = req.files.map((image) => image.filename);
                createProduct.image = fileData;
            } else {
                createProduct.image = null;
            }

            const saveProduct = await createProduct.save();
            res.status(200).send({ success: true, message: "Product create successfully" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.viewProduct = async (req, res) => {
    try {
        const Id = req.query._id;
        const categoryId = req.query.categoryId;
        const subCategoryId = req.query.subCategoryId;
        const companyId = req.query.companyId;

        if (Id) {
            const viewProduct = await Products.findOne({ _id: new ObjectId(Id) }, { createdAt: 0, updatedAt: 0 })
                .select("-__v")
                .populate({ path: "categoryId", select: "name" })
                .populate({ path: "subCategoryId", select: "name" })
                .populate({ path: "companyId", select: "name" })
            if (viewProduct) {
                if (viewProduct.image) {
                    var imageURL = viewProduct.image.map((getImage) =>
                        `${process.env.FILE_PATH}/${getImage}`
                    )
                    const data = {
                        _id: viewProduct._id,
                        name: viewProduct.name,
                        price: viewProduct.price,
                        image: imageURL,
                        description: viewProduct.description,
                        categoryId: viewProduct.categoryId,
                        subCategoryId: viewProduct.subCategoryId,
                        companyId: viewProduct.companyId,
                        status: viewProduct.status
                    }
                    res.status(200).send({ success: true, message: "Product viewed successfully", data: data });
                }
            } else {
                res.status(400).send({ success: false, message: "Invalid Id" });
            }
        }
        // else if (categoryId) {
        //     const viewAllProductByCategoryId = await Products.find({ categoryId: new ObjectId(categoryId) }, { _id: 0, name: 1, status: 1, price: 1, description: 1, image: 1 });
        //     res.status(200).send({ success: true, message: "All Products successfully viewed", data: viewAllProductByCategoryId });
        // }
        // else if (subCategoryId) {
        //     const viewAllProductBySubCategoryId = await Products.find({ subCategoryId: new ObjectId(subCategoryId) }, { _id: 0, name: 1, status: 1, price: 1, description: 1, image: 1 });
        //     res.status(200).send({ success: true, message: "All Products successfully viewed", data: viewAllProductBySubCategoryId });
        // }
        // else if (companyId) {
        //     const viewAllProductByCompanyId = await Products.find({ companyId: new ObjectId(companyId) }, { _id: 0, name: 1, status: 1, price: 1, description: 1, image: 1 });
        //     res.status(200).send({ success: true, message: "All Products successfully viewed", data: viewAllProductByCompanyId });
        // }
        else {
            const limit = parseInt(req.query.limit) || 500;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const viewAllProduct = await Products.find({}, { createdAt: 0, updatedAt: 0 })
                .select("-__v")
                .populate({ path: "categoryId", select: "name" })
                .populate({ path: "subCategoryId", select: "name" })
                .populate({ path: "companyId", select: "name" })
                .limit(limit)
                .skip(skip);
            if (viewAllProduct) {
                var getProduct = viewAllProduct.map((product) => {
                    return {
                        ...product.toObject(),
                        image: product.image.map((getImage) =>
                            `${process.env.FILE_PATH}/${getImage}`)
                    };
                });
            }
            res.status(200).send({ success: true, message: "All Products successfully viewed", getProduct });
        };
    }
    catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const { _id, name, status, price, description } = req.body;
        const image = req.files;
        const productExist = await Products.findOne({ _id: new ObjectId(_id) });

        if (productExist) {
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
            if (price) {
                condition.price = price;
            };
            if (description) {
                condition.description = description;
            };

            if (image[0]) {
                const getImage = image.map((images) => images.filename);
                condition.image = getImage;
                // Remove Existing Image
                productExist.image.map(
                    (fileData) => {
                        if (fs.existsSync(`${fileURL}${fileData}`)) {
                            fs.unlinkSync(`${fileURL}${fileData}`);
                        }
                    }
                )
            };
            const updateProduct = await Products.updateOne({ _id }, { $set: condition });
            res.status(200).send({ success: true, message: "Update Successfully", data: condition })
        } else {
            res.status(400).send({ success: false, message: "Invalid id" });
        }

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const Id = req.query._id;
        const categoryId = req.query.categoryId;
        const subCategoryId = req.query.subCategoryId;
        const companyId = req.query.companyId;

        if (Id) {
            const findProduct = await Products.findOne({ _id: new ObjectId(Id) });
            if (findProduct) {
                findProduct.image.map(
                    (fileData) => {
                        if (fs.existsSync(`${fileURL}${fileData}`)) {
                            fs.unlinkSync(`${fileURL}${fileData}`);
                        }
                    }
                )
                const deleteProduct = await Products.deleteOne({ _id: new ObjectId(Id) });
                res.status(200).send({ success: true, message: "Product delete successfully" });
            } else {
                res.status(400).send({ success: false, message: "Invalid Id" });
            }
        }
        // else if (categoryId) {
        //     const findProductByCategoryId = await Products.deleteMany({ categoryId: new ObjectId(categoryId) });
        //     res.status(200).send({ success: true, message: "All Products successfully delete" });
        // }
        // else if (subCategoryId) {
        //     const findProductBySubCategoryId = await Products.deleteMany({ subCategoryId: new ObjectId(subCategoryId) });
        //     res.status(200).send({ success: true, message: "All Products successfully delete" });
        // }
        // else if (companyId) {
        //     const findProductByCompanyId = await Products.deleteMany({ companyId: new ObjectId(companyId) });
        //     res.status(200).send({ success: true, message: "All Products successfully delete" });
        // }
        else {
            const findAllProduct = await Products.find({});
            if (findAllProduct) {
                var getAllProduct = findAllProduct.map((allProduct) => {
                    allProduct.image.map((deleteImage) => {
                        if (fs.existsSync(`${fileURL}${deleteImage}`)) {
                            fs.unlinkSync(`${fileURL}${deleteImage}`);
                        }
                    })
                })
            }

            const deleteAllProduct = await Products.deleteMany({});
            res.status(200).send({ success: true, message: "All Products successfully delete" });
        };
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.searchProduct = async (req, res) => {
    const { name, price, category, company, subCategory } = req.query;
    let filter = {};
    if (name) {
        filter.$or = [
            { name: { $regex: name, $options: 'i' } },
            { description: { $regex: name, $options: 'i' } },
        ];
    }
    if (price) {
        filter.price = { $lte: parseFloat(price) }; // Fixed the price filter
    }
    if (category) {
        const existCat = await Category.findOne({ name: { $regex: category, $options: 'i' } });
        if (existCat) {
            filter.categoryId = existCat._id;
        }
    }
    if (company) {
        const existComp = await Company.findOne({ name: { $regex: company, $options: 'i' } });
        if (existComp) {
            filter.companyId = existComp._id;
        }
    }
    if (subCategory) {
        const existSubCat = await SubCategory.findOne({ name: { $regex: subCategory, $options: 'i' } });
        if (existSubCat) {
            filter.subCategoryId = existSubCat._id;
        }
    }
    try {
        const limit = parseInt(req.query.limit) || 500;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const searchProduct = await Products.find(filter)
            .select("-__v")
            .populate({ path: "categoryId", select: "name" })
            .populate({ path: "subCategoryId", select: "name" })
            .populate({ path: "companyId", select: "name" })
            .limit(limit)
            .skip(skip);

        if (searchProduct && searchProduct.length > 0) {
            const getProduct = searchProduct.map((product) => ({
                ...product.toObject(),
                image: product.image.map((getImage) => `${process.env.FILE_PATH}/${getImage}`),
            }));
            const productCount = searchProduct.length;

            res.status(200).send({ success: true, message: "Products found Successfully", data: getProduct, productCount });
        } else {
            res.status(200).send({ success: true, message: "Products not found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}
