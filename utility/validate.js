const joi = require('joi');
const config = require('../config/const');

// validate user signup
module.exports.signup = async (req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(3).max(30).required()
                .pattern(
                    new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
                )
                .messages({
                    'string.pattern.base': '"name" contain only alphbates',
                    'string.empty': '"name" cannot be an empty field',
                    'string.min': '"name" contain minimum length of {#limit}',
                    'any.required': '"name" is a required field'
                }),
            email: joi.string().email().min(5).max(30).required(),
            mobile: joi.string().required()
                .pattern(
                    new RegExp('^[6-9][0-9]{9}$')
                )
                .messages({
                    'string.pattern.base': `"mobile" contain only 10 numbers
                    like "9685741248" & start with 6,7,8,9`,
                    'string.empty': '"mobile" cannot be an empty field',
                    'any.required': '"mobile" is a required field'
                }),
            password: joi.string().min(3).max(30).required(),
            confirmPassword: joi.ref('password')
        });
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
            error: err.details[0].message
        });
    }
};

// validate user signup
module.exports.login = async (req, res, next) => {
    try {
        const validate = joi.object({
            email: joi.string().email().min(5).max(30).required(),
            password: joi.string().min(3).max(30).required()
        });
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
            error: err.details[0].message
        });
    }
};

// validate user change password
module.exports.changePassword = async (req, res, next) => {
    try {
        const validate = joi.object({
            oldPassword: joi.string().min(3).max(30).required(),
            newPassword: joi.string().min(3).max(30).required(),
            confirmPassword: joi.ref('newPassword')
        });
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
            error: err.details[0].message
        });
    }
};

// validate product add
module.exports.add = async (req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(2).required(),
            price: joi.string().min(3).max(30).required()
        });
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
            error: err.details[0].message
        });
    }
};

// validate product update
module.exports.update = async (req, res, next) => {
    try {
        const validate = joi.object({
            id: joi.string().required(),
            name: joi.string().min(2).required(),
            price: joi.string().min(3).max(30).required()
        });
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
            error: err.details[0].message
        });
    }
};

// validate product add & update
module.exports.delete = async (req, res, next) => {
    try {
        const validate = joi.object({
            id: joi.string().required()
        });
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.status(config.statusCode.UNPROCESSABLE_ENTITY).json({
            error: err.details[0].message
        });
    }
};

// function to validate user add details form
module.exports.checkoutForm = async (req, res, next) => {
    try {
        const validate = joi.object({
            name: joi.string().min(3).max(30).trim().required(),
            email: joi.string().email().min(5).max(30).trim().required(),
            mobile: joi.string()
                .pattern(
                    new RegExp('^[6-9][0-9]{9}$')
                ).required(),
            address: joi.string().min(3).max(100).trim().required(),
            country: joi.string().min(3).max(30).trim().required(),
            state: joi.string().min(3).max(30).trim().required(),
            city: joi.string().min(3).max(30).trim().required(),
            zip: joi.string().min(6).max(6).trim().required()
                .pattern(
                    new RegExp('^[2-9][0-9]{5}$')
                )
        }).options({ allowUnknown: true }); ;
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.json({
            error: err.details[0].message
        });
    }
};

// function to validate user add details form
module.exports.addDetails = async (req, res, next) => {
    try {
        const validate = joi.object({
            address: joi.string().min(3).max(100).trim().required(),
            country: joi.string().min(3).max(30).trim().required(),
            state: joi.string().min(3).max(30).trim().required(),
            city: joi.string().min(3).max(30).trim().required(),
            zip: joi.string().min(6).max(6).trim().required()
                .pattern(
                    new RegExp('^[2-9][0-9]{5}$')
                )
        });
        await validate.validateAsync(req.body);
        return next();
    } catch (err) {
        res.json({
            error: err.details[0].message
        });
    }
};
