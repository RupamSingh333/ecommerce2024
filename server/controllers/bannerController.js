const Banner = require("../models/bannerModel");
const helper = require("../utils/helper");
const { ObjectId } = require("mongodb");
const randomstring = require("randomstring");
const path = require("path");
const fs = require("fs");
const { config } = require("process");

module.exports.addBanner = async (req, res) => {
    try {
        const name = await helper.capitalizeName(req.body.name);
        const image = req.file;
        if (!name) {
            fs.unlinkSync(req.file.path);
            res.status(400).send({ success: false, message: "Please enter a Name" });
        } else if (!image) {
            res.status(400).send({ success: false, message: "Please send a Image" });
        }
        else {
            const findName = await Banner.findOne({ name });
            if (findName) {
                if (image) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(400).send({ success: false, message: "Name Already Exist" })
            } else {
                const addData = new Banner({
                    name: name,
                    image: image.filename
                })
                const saveData = await addData.save();
                res.status(200).send({ success: true, message: "Banner added Successfully" });
            }
        };
    } catch (error) {
        console.log('Error in addBanner Function : ', error);
    }
};



