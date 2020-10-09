const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controllers');
const validate = require('../utility/validate');
const auth = require('../utility/auth');
const middleware = require('../utility/user.middleware');

// route for user signup
router.post('/signup',
    validate.signup,
    middleware.emailAndMobileCheck,
    user.signup
);

// route for user signin
router.post('/login',
    validate.login,
    user.login
);

// route for user profile
router.get('/profile',
    auth.verifyToken,
    user.profile
);

// route for user password
router.post('/resetPassword',
    auth.verifyToken,
    validate.changePassword,
    user.resetPassword
);

// route for add detail
router.put('/addDetails',
    auth.verifyToken,
    validate.addDetails,
    user.updateDetails
);

module.exports = router;
