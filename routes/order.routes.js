const express = require('express');
const router = express.Router();
const auth = require('../utility/auth');
const order = require('../controllers/order.controllers');
const validate = require('../utility/validate');
const middleware = require('../utility/cart.middleware');

// route for payment
router.post('/pay',
    auth.verifyToken,
    auth.userCheck,
    middleware.cartCount,
    validate.checkoutForm,
    order.pay
);

// routes for order details
router.get('/details',
    auth.verifyToken,
    auth.userCheck,
    order.details
);

// routes for Payment details
router.get('/payment',
    auth.verifyToken,
    auth.userCheck,
    order.payment
);

module.exports = router;
