const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    categories: [
        {
            type: String,
        }
    ],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model("shop", shopSchema);