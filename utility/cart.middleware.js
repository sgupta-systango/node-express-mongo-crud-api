const carts = require('../models/cart');

module.exports.productCheckInCart = async (req, res, next) => {
    try {
        const {
            productId,
            quantity
        } = req.body;
        const cart = await carts.findOne({
            productId: productId,
            userId: req.user.user._id
        });
        if (cart) {
            const newQuantity = parseInt(cart.quantity) + parseInt(quantity);
            const newCart = await carts.findByIdAndUpdate(cart._id, {
                $set: {
                    quantity: newQuantity
                }
            }, {
                new: true
            });
            if (newCart) {
                res.json({
                    msg: 'product added in cart',
                    data: newCart
                });
            } else {
                return next();
            }
        } else {
            return next();
        }
    } catch (err) {
        res.send(err.stack);
    }
};

module.exports.cartCount = async (req, res, next) => {
    try {
        const cart = await carts.countDocuments({
            userId: req.user.user._id
        });
        console.log('Item in cart: ' + cart);
        if (cart) {
            return next();
        } else {
            res.json({
                msg: 'please add item in cart first'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};
