const mongoose = require('mongoose');
const Str = require('@supercharge/strings');
const config = require('../config/const');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Carts = require('../models/cart');
const Orders = require('../models/order');
const Payments = require('../models/payment');

// function to initiate payment
module.exports.pay = async(req, res) => {
    try {
        const cart = await Carts.aggregate([{
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $match: {
                    userId: mongoose.Types.ObjectId(req.user.user._id)
                }
            },
            {
                $unwind: '$product'
            }
        ]);

        const fprice = cart.map((rec) => {
            return rec.product.price * rec.quantity;
        });
        const finaldata = cart.map((rec, index) => {
            var pair = {
                fprice: fprice[index]
            };
            var objs = {
                ...rec,
                ...pair
            };
            return objs;
        });
        const grandTotal = fprice.reduce((total, num) => {
            return total + num;
        }, 0);

        const {
            name,
            mobile,
            address,
            country,
            state,
            city,
            zip
        } = req.body;
        const amount = grandTotal;
        const token = req.body.stripeToken;

        const customer = await stripe.customers.retrieve(
            req.user.user.stripeCustomerId
        );
        const card = await stripe.customers.createSource(customer.id, {
            source: token
        });

        stripe.charges.create({
            amount: amount,
            currency: 'inr',
            source: card.id,
            customer: customer.id,
            shipping: {
                address: {
                    country: country,
                    state: state,
                    city: city,
                    line1: address,
                    postal_code: zip
                },
                name: name,
                phone: mobile
            }
        }, async(err, charge) => {
            console.log(charge);
            if (err) {
                console.log(err);
                console.log('Card Decliend');
                res.json({
                    msg: 'Card Decliend'
                });
            } else {
                const orderId = new mongoose.Types.ObjectId();
                const newPayment = new Payments({
                    tokenId: token,
                    customerId: customer.id,
                    chargeId: charge.id,
                    transactionId: charge.balance_transaction,
                    orderId: orderId,
                    mode: charge.payment_method_details.type,
                    amount: charge.amount,
                    paymentDate: new Date().toUTCString(),
                    status: charge.status
                });
                await newPayment.save();

                finaldata.forEach((data) => {
                    const newOrder = new Orders({
                        orderId: orderId,
                        userId: req.user.user._id,
                        productId: data.productId,
                        quantity: data.quantity,
                        amount: data.fprice,
                        refString: Str.random(8),
                        orderDate: new Date().toDateString(),
                        shipping: charge.shipping
                    });
                    newOrder.save();
                });

                await Carts.deleteMany({
                    userId: req.user.user._id
                });
                res.json({
                    msg: 'order placed'
                });
            }
        });
    } catch (err) {
        res.send(err.stack);
    }
};

// fun to get order history
module.exports.details = async(req, res) => {
    try {
        const order = await Orders.aggregate([{
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $match: {
                    userId: mongoose.Types.ObjectId(req.user.user._id)
                }
            },
            {
                $unwind: '$product'
            }
        ]);
        if (order.length !== 0) {
            res.json({
                msg: 'Order Details',
                data: order
            });
        } else {
            res.status(config.statusCode.NOT_FOUND).json({
                msg: 'No data found'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};

// function to get payment details
module.exports.payment = async(req, res) => {
    try {
        const result = await Orders.aggregate([{
                $match: {
                    userId: mongoose.Types.ObjectId(req.user.user._id)
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'orderId',
                    foreignField: 'orderId',
                    as: 'payment'
                }
            },
            {
                $unwind: '$payment'
            },
            {
                $group: {
                    _id: '$orderId',
                    orderedItems: {
                        $sum: 1
                    },
                    tokenId: {
                        $first: '$payment.tokenId'
                    },
                    chargeId: {
                        $first: '$payment.chargeId'
                    },
                    transactionId: {
                        $first: '$payment.transactionId'
                    },
                    mode: {
                        $first: '$payment.mode'
                    },
                    amount: {
                        $first: '$payment.amount'
                    },
                    paymentDate: {
                        $first: '$payment.paymentDate'
                    },
                    status: {
                        $first: '$payment.status'
                    }
                }
            },
            {
                $sort: {
                    paymentDate: -1
                }
            }
        ]);
        if (result.length !== 0) {
            res.json({
                msg: 'Payment Details',
                data: result
            });
        } else {
            res.status(config.statusCode.NOT_FOUND).json({
                msg: 'No data found'
            });
        }
    } catch (err) {
        res.send(err.stack);
    }
};
