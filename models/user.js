const mongoose = require('mongoose');
// const crypto = require('crypto')
const CryptoJS = require('crypto-js');

// user model
const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    address: String,
    country: String,
    state: String,
    city: String,
    zip: String,
    role: String,
    stripeCustomerId: String,
    password: String
});

// Method to set salt and hash the password for a user
userSchema.methods.setPassword = function (password) {
    this.password = CryptoJS.AES
        .encrypt(password, 'secret key 123')
        .toString();
};

// Method to check the entered password is correct or not
userSchema.methods.validPassword = function (password) {
    var bytes = CryptoJS.AES
        .decrypt(this.password, 'secret key 123')
        .toString(CryptoJS.enc.Utf8);
    return password === bytes;
};

module.exports = mongoose.model('user', userSchema);
