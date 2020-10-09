const jwt = require('jsonwebtoken');
const config = require('../config/const');

// verify the users tokens
module.exports.verifyToken = (req, res, next) => {
    var token = req.headers.authorization;
    if (!token) {
        return res.status(config.statusCode.FORBIDDEN).json({
            auth: false,
            message: 'No token provided.'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(config.statusCode.INTERNAL_SERVER_ERROR).json({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }
        // if everything good, save to request for use in other routes
        req.user = decoded;
        return next();
    });
};

// functon to check role is admin or not
module.exports.adminCheck = (req, res, next) => {
    try {
        if (req.user.user.role === 'admin') {
            return next();
        } else {
            res.json({
                msg: 'Unauthorised user'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};

// function to check role is user or not
module.exports.userCheck = (req, res, next) => {
    try {
        if (req.user.user.role === 'user') {
            return next();
        } else {
            res.json({
                msg: 'Unauthorised user'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};
