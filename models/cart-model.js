const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
          quantity: Number,
          priceAtOrder: Number,
          totalPrice: Number
        }
      ]
});

module.exports = mongoose.model('cart', cartSchema);