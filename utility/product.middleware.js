const config = require('../config/const');
const Products = require('../models/product');

// function to check product name is already exist or not
module.exports.nameCheck = async (req, res, next) => {
    try {
        const {
            name
        } = req.body;
        const product = await Products.findOne({
            name: name
        });
        if (product) {
            res.status(config.statusCode.CONFLICT).json({
                msg: product.name + ' already exist'
            });
        } else {
            return next();
        }
    } catch (err) {
        res.send(err.stack);
    }
};

// function to check product name is already exist or not
module.exports.nameCheckForUpdate = async (req, res, next) => {
    try {
        const {
            id,
            name
        } = req.body;
        const product = await Products.findOne({
            _id: {
                $ne: id
            },
            name
        });
        if (product) {
            res.status(config.statusCode.CONFLICT).json({
                msg: product.name + ' already exist'
            });
        } else {
            return next();
        }
    } catch (err) {
        res.send(err.stack);
    }
};
