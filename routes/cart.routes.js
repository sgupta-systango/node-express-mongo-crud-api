const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart.controllers');
const auth = require('../utility/auth');
const middleware = require('../utility/cart.middleware');

// routes for adding item to user cart
router.post('/addCartAction',
    auth.verifyToken,
    auth.userCheck,
    middleware.productCheckInCart,
    cart.add
);

// routes for view cart that user added
router.get('/viewCart',
    auth.verifyToken,
    auth.userCheck,
    cart.get
);

// routes to delete items from cart
router.delete('/deleteCartItem',
    auth.verifyToken,
    auth.userCheck,
    middleware.cartCount,
    cart.deleteItem
);

module.exports = router;
