const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
const productModel = require('../models/product-model');
const generateToken = require('../utils/generateToken');
const categoryModel = require('../models/category-model');
const Cart = require('../models/cart-model');
const WishList = require('../models/wishlist-model');
const mongoose = require('mongoose');

module.exports.HomePage = async function(req, res) {
    const isLoggedIn = !!req.session.user;
    // console.log(req.session.userid);
    let categories = await categoryModel.find({status:true});
    let products = await productModel.find({status:true}).limit(10);
    res.render('home', { isLoggedIn , products, categories});
};

module.exports.WishListPage = async function(req, res) {
    try {
        const wishlist = await WishList.findOne({ user: req.session.user.userid })
            .populate('products.product'); // populate product details

        res.render('wishlist', { wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports.addToWishList = async function(req, res) {
    const { productId } = req.body;
    const userId = req.session.user.userid;

    if (!productId) return res.status(400).json({ success:false, message: "Product ID missing." });

    try {
        let wishlist = await WishList.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new WishList({
                user: userId,
                products: [{ product: productId }]
            });
        } else {
            const exists = wishlist.products.some(
                (item) => item.product.toString() === productId
            );

            if (exists) {
                return res.status(409).json({success:false, message: "Already in wishlist." });
            }

            wishlist.products.push({ product: productId });
        }

        await wishlist.save();
        res.status(200).json({success:true, message: "Added to wishlist." });

    } catch (err) {
        console.error(err);
        res.status(500).json({success:false,  message: "Something went wrong." });
    }
};


module.exports.removeFromWishList = async function(req, res) {
  const userId = req.session.user.userid;
  const productId = req.params.productId;

  try {
    const result = await WishList.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: new mongoose.Types.ObjectId(productId) } } },
      { new: true }
    );


    console.log(result);

    if (!result) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, message: "Product removed from wishlist." });

  } catch (err) {
    console.error("Error in removeFromWishList:", err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};




module.exports.addToCart = async function(req, res) {

    try {

        const {productId} = req.body;
        const quantity =  parseInt(req.body.quantity) || 1;
        const userId = req.session.user.userid;

        if (!productId) {
            return res.status(400).json({"success": false, "message": "product id was not send"})
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }
        
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const pricePerUnit = product.sale_price;

        const existingProductIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (existingProductIndex > -1) {
            // If product already in cart, update quantity and totalPrice
            cart.products[existingProductIndex].quantity += quantity;
            cart.products[existingProductIndex].totalPrice =
                cart.products[existingProductIndex].quantity * pricePerUnit;
        } else {
            // Else add new product
            cart.products.push({
                product: productId,
                quantity,
                priceAtOrder: pricePerUnit,
                totalPrice: quantity * pricePerUnit
            });
        }

        await cart.save();

        return res.status(200).json({"success": true, "message": `${product.name} was added to cart succesfully`});
    } catch(err) {
        console.error("Error occured while adding to cart : "+err);
        return res.status(500).json({"success": false, "message": "Something went wrong"});
    }
};

module.exports.getCart = async (req, res) => {
    try {
      if (!req.session.user.userid) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const cart = await Cart.findOne({ user: req.session.user.userid }).populate({
        path: 'products.product',
        select: 'name images reg_price'
      });
  
      if (!cart) {
        return res.json({ success: true, products: [] });
      }
  
      const cartItems = cart.products.map(item => ({
        id: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        reg_price: item.product.reg_price,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      }));
  
      res.json({ success: true, products: cartItems });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  module.exports.updateCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOne({ user: req.session.user.userid });
      if (!cart) return res.json({ success: false });
  
      const item = cart.products.find(p => p.product.toString() === productId);
      if (item) {
        item.quantity = quantity;
        item.totalPrice = quantity * item.priceAtOrder;
        await cart.save();
      }
  
      return res.status(200).json({ success: true , totalPrice: item.totalPrice});
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  };
  
  