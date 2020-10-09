const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');

const app = express();

// dotenv configuration
dotEnv.config({
    path: '.env',
    encoding: 'utf8'
});

// imports user routes
const Users = require('./routes/user.routes');

// imports products routes
const Products = require('./routes/product.routes');

// imports carts routes
const Carts = require('./routes/cart.routes');

// imports orders routes
const Orders = require('./routes/order.routes');

// importing dbconnect module
const dbconnect = require('./config/dbconnect');

// configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// call the dbconnect function to connect to mongoose localhost server
dbconnect.db();

// configure routes
app.use('/user', Users);
app.use('/product', Products);
app.use('/cart', Carts);
app.use('/order', Orders);

app.get('*', (req, res) => {
    res.status(404).json({
        msg: 'Page not found'
    });
});

// listening port to start the server
app.listen(process.env.PORT, () => {
    console.log(`Server started at port:${process.env.PORT}`);
});
