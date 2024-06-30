const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Product = require("../models/productModel");
const { ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");
const { log } = require("console");
require('dotenv').config()

const stripe = require("stripe")('sk_test_51OGy4BSEWW2cslHik2PtEBrFhq4uJL33DD428TzkcPZtAYC7oY70dzr0jHc409HHa9DE1tmtMh9a8bfdrPZCMs6c00d8UNy4R5');


module.exports.createOrder = async (req, res) => {
    const { name, email, _id } = req.user.data;
    const { totalAmount, paymentMode, orderItems, deliveryDetails } = req.body;

    try {
        const orderItemIds = [];

        for (const cur of orderItems) {
            const createOrderItem = new OrderItem({
                productId: cur.productId,
                quantity: cur.quantity,
                price: cur.price,
                productName: cur.productName,
            });

            const savedOrderItem = await createOrderItem.save();
            orderItemIds.push(savedOrderItem._id);
        }

        const rand = Math.random().toString(16).substr(2, 16);

        const createOrder = new Order({
            orderItems: orderItemIds,
            customerName: name,
            email: email,
            totalAmount: totalAmount,
            paymentMode: paymentMode,
            userId: _id,
            deliveryDetails: deliveryDetails,
            orderNumber: rand,
        });

        const savedOrder = await createOrder.save();

        if (paymentMode == "Online") {

            const lineItems = orderItems.map((product) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.productName,
                        images: [product.imgdata]
                    },
                    unit_amount: product.price * 100,
                },
                quantity: product.quantity
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: `http://localhost:5173/sucess/${savedOrder._id}`,
                cancel_url: `http://localhost:5173/cancel/${savedOrder._id}`,
            });

            res.json({ id: session.id })

        } else {
            res.status(200).send({ success: true, message: "Create Order Successfully" })
        }


    } catch (error) {
        console.error("Error in createOrder function:", error);
        res.status(400).send({
            success: false,
            message: "Error in createOrder function",
            error,
        });
    }
};

module.exports.changeOrderStatus = async (req, res) => {
    try {
        const { _id } = req.query;
        const findOrder = await Order.findOne({ _id: new ObjectId(_id) });

        if (findOrder) {
            if (findOrder.orderStatus == "Pending") {
                const changeStatus = await Order.updateOne({ _id }, { $set: { orderStatus: "Processing" } });
            } else if (findOrder.orderStatus == "Processing") {
                const changeStatus = await Order.updateOne({ _id }, { $set: { orderStatus: "Shipped" } });
            } else if (findOrder.orderStatus == "Shipped") {
                const changeStatus = await Order.updateOne({ _id }, { $set: { orderStatus: "Delivered" } });
            }
            res.status(200).send({ success: true, message: "Status Updated Successfully" });
        } else {
            res.status(400).send({ success: false, message: "Order not found" });
        }

    } catch (error) {
        console.log("Error from changeOrderStatus function", error);
    }
};

module.exports.viewOrder = async (req, res) => {
    try {
        const { _id } = req.user.data;
        const findOrder = await Order.find({ userId: new ObjectId(_id) }, { updatedAt: 0 })
            .select("-__v")
            .populate({
                path: "orderItems",
                populate: {
                    path: "productId",
                    model: "Product",
                    populate: [{
                        path: "categoryId",
                        model: "Category"
                    },
                    {
                        path: "companyId",
                        model: "Company"
                    }]
                }
            });

        if (findOrder) {

            const data = findOrder.map((cur) => {
                return {
                    _id: cur._id,
                    customerName: cur.customerName,
                    email: cur.email,
                    userId: cur.userId,
                    orderItems: cur.orderItems.map((data) => {
                        return {
                            _id: data._id,
                            productId: {
                                _id: data.productId._id,
                                name: data.productId.name,
                                price: data.productId.price,
                                image: data.productId.image.map((img) => {
                                    return (
                                        `${process.env.FILE_PATH}/${img}`
                                    )
                                }),
                                description: data.productId.description,
                                categoryId: data.productId.categoryId,
                                companyId: data.productId.companyId,
                                status: data.productId.status,
                            },
                            productName: data.productName,
                            quantity: data.quantity,
                            price: data.price,
                        }
                    }),
                    deliveryDetails: cur.deliveryDetails,
                    totalAmount: cur.totalAmount,
                    paymentMode: cur.paymentMode,
                    orderStatus: cur.orderStatus,
                    orderNumber: cur.orderNumber,
                    createdAt: cur.createdAt
                }
            })

            res.status(200).send({ success: true, message: "Order viewed successfully", data: data });
        } else {
            res.status(200).send({ success: true, message: "Order not Found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.viewAllOrder = async (req, res) => {
    try {
        const findOrder = await Order.find({})
            .select("-__v")
            .populate({
                path: "orderItems",
                populate: {
                    path: "productId",
                    model: "Product",
                    populate: [{
                        path: "categoryId",
                        model: "Category"
                    },
                    {
                        path: "companyId",
                        model: "Company"
                    }]
                }
            });
        if (findOrder) {
            // console.log(findOrder);
            const data = findOrder.map((cur) => {
                return {
                    _id: cur._id,
                    customerName: cur.customerName,
                    email: cur.email,
                    userId: cur.userId,
                    orderItems: cur.orderItems.map((data) => {
                        console.log(data);
                        return {
                            _id: data._id,
                            productName: data.productName,
                            quantity: data.quantity,
                            price: data.price,
                        }
                    }),
                    deliveryDetails: cur.deliveryDetails,
                    totalAmount: cur.totalAmount,
                    paymentMode: cur.paymentMode,
                    orderStatus: cur.orderStatus,
                    orderNumber: cur.orderNumber,
                    createdAt: cur.createdAt
                }
            })

            res.status(200).send({ success: true, message: "Order viewed successfully", data: data });
        } else {
            res.status(200).send({ success: true, message: "Order not Found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

module.exports.deleteOrder = async (req, res) => {
    try {
        const { _id } = req.query;
        const findOrder = await Order.find({ _id: new ObjectId(_id) });
        if (findOrder) {
            for (const cur of findOrder) {
                cur.orderItems.map(async (item) => {
                    await OrderItem.deleteMany({ _id: new ObjectId(item._id) })
                })
            }
            await Order.deleteOne({ _id: new ObjectId(_id) });
            res.status(200).send({ success: true, message: "Order deleted successfully" });
        } else {
            res.status(400).send({ success: false, message: "Order not found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}