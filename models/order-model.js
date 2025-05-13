const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    products: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number
        },
        amount: {
            type: Number
        }
    }],
    totalquantity: {
        type: Number,
    },
    totalamount: {
        type: Number
    }
},{
    timestamps: true
})

module.exports = mongoose.model('order', orderSchema);