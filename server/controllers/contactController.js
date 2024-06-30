const Contact = require("../models/contactModel");
const helper = require("../utils/helper");
const { ObjectId } = require("mongodb");

module.exports.contactUs = async (req, res) => {
    try {
        const name = await helper.capitalizeName(req.body.name);
        const { email, mobile, reason } = req.body;

        const saveContact = new Contact({
            name: name,
            email: email,
            mobile: mobile,
            reason: reason
        });
        const saveData = await saveContact.save();
        const sendMailResponse = helper.sendEmail(email, 'Contact regarding', 'Thank you for contact us',
            `<p>Thank You <b> ${name} </b> for contact with us.</p> <p>We will respond to you soon.</p>`)
        res.status(200).send({ success: true, message: "Thank you for contact us.", data: saveContact });

    } catch (error) {
        console.log("Error in contactUs function", error);
    };
};

module.exports.viewAllContact = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 500;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const viewAllContact = await Contact.find({})
            .select("-__v")
            .limit(limit)
            .skip(skip);
        res.status(200).send({ success: true, message: "All User viewed successfully", data: viewAllContact });
    } catch (error) {
        console.log("Error from viewAllUser Function", error);
    }
};

module.exports.deleteContact = async (req, res) => {
    try {
        const { _id } = req.query;
        const findContact = await Contact.findOne({ _id: new ObjectId(_id) });
        if (findContact) {

            const deleteContact = await Contact.deleteOne({ _id });
            res.status(200).send({ success: true, message: "Contact has been delete successfully" });
        } else {
            res.status(400).send({ success: false, message: "Contact can't find" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

