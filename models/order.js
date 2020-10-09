const mongoose = require('mongoose');
const products = require('./product');
const users = require('./user');

// order model
const orderSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: users
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: products
    },
    quantity: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    refString: {
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: String
    },
    shipping: {
        type: Object
    }
});

module.exports = mongoose.model('order', orderSchema);
