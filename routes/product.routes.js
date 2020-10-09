const express = require('express');
const router = express.Router();
const product = require('../controllers/product.controllers');
const auth = require('../utility/auth');
const validate = require('../utility/validate');
const middleware = require('../utility/product.middleware');

// route for add product
router.post('/',
    auth.verifyToken,
    auth.adminCheck,
    validate.add,
    middleware.nameCheck,
    product.add
);

// route for get product
router.get('/',
    auth.verifyToken,
    product.get
);

// route for update product
router.put('/',
    auth.verifyToken,
    auth.adminCheck,
    validate.update,
    middleware.nameCheckForUpdate,
    product.update
);

// route for delete product
router.delete('/',
    auth.verifyToken,
    auth.adminCheck,
    validate.delete,
    product.delete
);

module.exports = router;
