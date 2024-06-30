const Company = require("../models/companyModel");
const helper = require("../utils/helper");
const { ObjectId } = require("mongodb");

module.exports.createCompany = async (req, res) => {
    try {
        const companyName = await helper.capitalizeName(req.body.name);
        if (!companyName) {
            res.status(400).send({ success: false, message: "Please Enter a Valid Name" });
            return false;
        };
        const companyExist = await Company.findOne({ name: companyName });
        if (companyExist) {
            res.status(400).send({ success: false, message: "Company Already Exist" });
        } else {
            const createCompany = new Company({
                name: companyName
            });
            const saveCompany = await createCompany.save();
            res.status(200).send({ success: true, message: "Company create successfully" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.viewCompany = async (req, res) => {
    try {
        const Id = req.query._id;
        if (Id) {
            const viewCompany = await Company.findOne({ _id: new ObjectId(Id) }, { _id: 1, name: 1, status: 1 });
            if (viewCompany) {
                res.status(200).send({ success: true, message: "Company viewed successfully", data: viewCompany });
            } else {
                res.status(400).send({ success: false, message: "Invalid Id" });
            }
        }
        else {
            const viewAllCompany = await Company.find({}, { _id: 1, name: 1, status: 1 });
            res.status(200).send({ success: true, message: "All Company successfully viewed", data: viewAllCompany });
        };
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};


module.exports.updateCompany = async (req, res) => {
    try {
        const { _id, name, status } = req.body;
        const companyExist = await Company.findOne({ _id });
        if (companyExist) {
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
            const updateCompany = await Company.updateOne({ _id }, { $set: condition });
            res.status(200).send({ success: true, message: "Update Successfully", data: condition })
        } else {
            res.status(400).send({ success: false, message: "Invalid id" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.deleteCompany = async (req, res) => {
    try {
        const Id = req.query._id;
        if (Id) {
            const findCompany = await Company.findOne({ _id: new ObjectId(Id) });
            if (findCompany) {
                const deleteCompany = await Company.deleteOne({ _id: new ObjectId(Id) });
                res.status(200).send({ success: true, message: "Company delete successfully" });
            } else {
                res.status(400).send({ success: false, message: "Invalid Id" });
            }
        }
        else {
            const deleteAllCompany = await Company.deleteMany({});
            res.status(200).send({ success: true, message: "All Company successfully deleted" });
        };
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};






