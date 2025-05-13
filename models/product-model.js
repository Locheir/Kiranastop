const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    images: [
        {type: String}
    ],
    quantity: {
        type: Number
    },
    description: {
        type: String
    },
    weight: {
        type: Number
    },
    category: {
        type: String
    },
    reg_price: {
        type: Number
    },
    sale_price: {
        type: Number
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop"
    },
    status: {
        type: Boolean
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("product", productSchema);