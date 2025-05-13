const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
    },
    products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        }
      ]
});

module.exports = mongoose.model('wishlist', wishlistSchema);