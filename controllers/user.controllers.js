const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const config = require('../config/const');

const Users = require('../models/user');

// function for user signup
module.exports.signup = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            password
        } = req.body;

        const customer = await stripe.customers.create({
            name: name,
            email: email,
            phone: mobile,
            description: 'My Stripe Test Customer (created for API docs)'
        });
        const newUser = new Users({
            name: name,
            email: email,
            mobile: mobile,
            role: 'user',
            stripeCustomerId: customer.id
        });
        newUser.setPassword(password);
        newUser.save().then((user) => {
            res.status(config.statusCode.CREATED).json({
                msg: 'registration successful',
                data: user
            });
        });
    } catch (err) {
        res.send(err.stack);
    }
};

// function for user login
module.exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        const user = await Users.findOne({
            email: email.toLowerCase()
        });
        if (user) {
            if (user.validPassword(password)) {
                // create tokens for users
                const token = jwt.sign({
                    user: user
                }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.json({
                    user: user,
                    msg: 'Login successfull',
                    token: token
                });
            } else {
                res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
                    msg: ' Wrong password'
                });
            }
        } else {
            res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
                msg: ' User not exist'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};

// function to get user profile who have loggged in
module.exports.profile = (req, res) => {
    try {
        const user = req.user.user;
        res.json({
            user: user
        });
    } catch (err) {
        res.send(err.stack);
    }
};

// function to add/update user details
module.exports.updateDetails = async (req, res) => {
    try {
        const {
            address,
            country,
            state,
            city,
            zip
        } = req.body;

        const user = await Users.findByIdAndUpdate(req.user.user._id, {
            $set: {
                address,
                country,
                state,
                city,
                zip
            }
        }, {
            new: true
        });
        if (user) {
            res.json({
                msg: 'Details updated',
                data: user
            });
        } else {
            res.json({
                msg: 'Details not updated'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};

// function to change user password using crypto-js
module.exports.resetPassword = async (req, res) => {
    try {
        const {
            oldPassword,
            newPassword
        } = req.body;
        const user = await Users.findOne({
            _id: req.user.user._id
        });
        if (user.validPassword(oldPassword)) {
            user.setPassword(newPassword);
            user.save();
            res.json({
                msg: 'change password successfull'
            });
        } else {
            res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
                msg: 'password not matched'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};
