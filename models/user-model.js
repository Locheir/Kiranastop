const { Timestamp } = require('bson');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    },
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wishlist'
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order'
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);