const mongoose = require('mongoose');
const config = require('../config/const');
const Carts = require('../models/cart');

// function to add selected product in  user cart
module.exports.add = (req, res) => {
    try {
        const {
            productId,
            quantity
        } = req.body;
        const newCart = new Carts({
            quantity: quantity,
            productId: productId,
            userId: req.user.user._id
        });
        newCart.save().then((cart) => {
            res.json({
                msg: 'Product added in cart',
                data: cart
            });
        });
    } catch (err) {
        res.send(err.stack);
    }
};

// function to get all item of the cart with product details
module.exports.get = async (req, res) => {
    try {
        const cart = await Carts.aggregate([{
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $match: {
                userId: mongoose.Types.ObjectId(req.user.user._id)
            }
        },
        {
            $unwind: '$product'
        }
        ]);

        if (cart.length !== 0) {
            const fprice = cart.map((rec) => {
                return rec.product.price * rec.quantity;
            });
            const finaldata = cart.map((rec, index) => {
                var pair = {
                    fprice: fprice[index]
                };
                var objs = {
                    ...rec,
                    ...pair
                };
                return objs;
            });
            const grandTotal = fprice.reduce((total, num) => {
                return total + num;
            }, 0);
            res.json({
                cart: finaldata,
                grandTotal: grandTotal
            });
        } else {
            res.status(config.statusCode.NOT_FOUND).json({
                msg: 'cart is empty'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};

// function to delete items from the cart
module.exports.deleteItem = async (req, res) => {
    try {
        const {
            productId
        } = req.body;
        const cart = await Carts.findByIdAndDelete(productId);
        if (cart) {
            res.json({
                msg: 'Item deleted',
                data: cart
            });
        } else {
            res.json({
                msg: 'Item not deleted'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};
