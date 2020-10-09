const Users = require('../models/user');
const config = require('../config/const');

// function for checking email & mobile is already exist or not
module.exports.emailAndMobileCheck = async (req, res, next) => {
    try {
        const {
            email,
            mobile
        } = req.body;
        const user = await Users.findOne({
            $or: [{
                email: email.toLowerCase()
            }, {
                mobile: mobile
            }]
        });
        if (user) {
            if (user.email === email.toLowerCase()) {
                res.status(config.statusCode.CONFLICT).json({
                    msg: 'email already exist'
                });
            } else if (user.mobile === mobile) {
                res.status(config.statusCode.CONFLICT).json({
                    msg: 'mobile no. already exist'
                });
            }
        } else {
            return next();
        }
    } catch (err) {
        res.send(err.stack);
    }
};
