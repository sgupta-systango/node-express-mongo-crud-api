const mongoose = require('mongoose');
// Get Url Of Mongodb to connect
module.exports.db = () => {
    mongoose.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
};
