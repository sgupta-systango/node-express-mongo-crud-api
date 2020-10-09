const mongoose = require('mongoose');
const products = require('./product');
const users = require('./user');

// cart model
const cartSchema = mongoose.Schema({
    quantity: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: products
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: users
    }
});

module.exports = mongoose.model('cart', cartSchema);
