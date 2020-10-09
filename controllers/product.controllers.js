const config = require('../config/const');

const Products = require('../models/product');

module.exports.add = (req, res) => {
    try {
        const {
            name,
            price
        } = req.body;
        const newProduct = new Products({
            name: name,
            price: price
        });
        newProduct.save().then((product) => {
            res.status(config.statusCode.CREATED).json({
                product: product,
                message: 'product added successful'
            });
        });
    } catch (err) {
        res.send(err.stack);
    }
};

module.exports.get = async (req, res, next) => {
    try {
        // get the products of a particular user
        const product = await Products.find({});
        if (product.length !== 0) {
            res.json({
                products: product
            });
        } else {
            res.status(config.statusCode.NOT_FOUND).json({
                msg: 'No product found'
            }); // No content
        }
    } catch (err) {
        res.send(err.stack);
    }
};

module.exports.update = async (req, res) => {
    const {
        id,
        name,
        price
    } = req.body;
    try {
        // find product by id, if exist update that product
        const product = await Products.findByIdAndUpdate(id, {
            $set: {
                name: name.toLowerCase(),
                price: price
            }
        }, {
            new: true
        });
        if (product) {
            res.json({
                product: product,
                msg: 'Product Successfull updated'
            });
        } else {
            res.status(config.statusCode.NOT_FOUND).json({
                msg: 'product id not found & it cannot be updated'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};

module.exports.delete = async (req, res) => {
    const {
        id
    } = req.body;
    try {
        // find the product id, if exist delete that product
        const product = await Products.findByIdAndDelete(id);
        if (product) {
            res.json({
                product: product,
                msg: 'Product Successfull deleted'
            });
        } else {
            res.status(config.statusCode.NOT_FOUND).json({
                msg: 'product id not found'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};
