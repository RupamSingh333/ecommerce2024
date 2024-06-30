const SubCategory = require("../models/subCategoryModel");
const helper = require("../utils/helper");
const { ObjectId } = require("mongodb");

module.exports.createSubCategory = async (req, res) => {
  try {
    const subCategoryName = await helper.capitalizeName(req.body.name);
    if (!subCategoryName) {
      res.status(400).send({ success: false, message: "Please Enter a Valid Name" });
      return false;
    };
    const subCategoryExist = await SubCategory.findOne({ name: subCategoryName });
    if (subCategoryExist) {
      res.status(400).send({ success: false, message: "SubCategory Already Exist" });
    } else {
      const createSubCategory = new SubCategory({
        name: subCategoryName
      });
      const saveSubCategory = await createSubCategory.save();
      res.status(200).send({ success: true, message: "SubCategory create successfully" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.viewSubCategory = async (req, res) => {
  try {
    const Id = req.query._id;
    if (Id) {
      const viewSubCategory = await SubCategory.findOne({ _id: new ObjectId(Id) }, { _id: 0, name: 1, status: 1 });
      if (viewSubCategory) {
        res.status(200).send({ success: true, message: "SubCategory viewed successfully", data: viewSubCategory });
      } else {
        res.status(400).send({ success: false, message: "Invalid Id" });
      }
    }
    else {
      const viewAllSubCategory = await SubCategory.find({}, { _id: 0, name: 1, status: 1 });
      res.status(200).send({ success: true, message: "All SubCategory successfully viewed", data: viewAllSubCategory });
    };
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.updateSubCategory = async (req, res) => {
  try {
    const { _id, name, status } = req.body;
    const subCategoryExist = await SubCategory.findOne({ _id });
    if (subCategoryExist) {

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

      const updateCategory = await SubCategory.updateOne({ _id }, { $set: condition });
      res.status(200).send({ success: true, message: "Update Successfully", data: condition })
    } else {
      res.status(400).send({ success: false, message: "Invalid id" });
    }

  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.deleteSubCategory = async (req, res) => {
  try {
    const Id = req.query._id;
    if (Id) {
      const findSubCategory = await SubCategory.findOne({ _id: new ObjectId(Id) });
      if (findSubCategory) {
        const deleteSubCategory = await SubCategory.deleteOne({ _id: new ObjectId(Id) });
        res.status(200).send({ success: true, message: "SubCategory delete successfully" });
      } else {
        res.status(400).send({ success: false, message: "Invalid Id" });
      }
    }
    else {
      const deleteAllSubCategory = await SubCategory.deleteMany({});
      res.status(200).send({ success: true, message: "All SubCategory successfully deleted" });
    };
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};






