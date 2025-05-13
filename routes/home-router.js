const express = require('express');
const homeController = require('../controllers/home-controller');
const router = express.Router();
const loginRequired = require('../middlewares/login_required');

router.get('/', homeController.HomePage);
router.get('/wishlist', homeController.WishListPage);
router.post('/wishlist/add',loginRequired, homeController.addToWishList);
router.delete('/wishlist/remove/:productId', homeController.removeFromWishList);

router.post('/addToCart',loginRequired, homeController.addToCart);
router.post('/update-cart', homeController.updateCart);
router.get('/getCart', homeController.getCart);


module.exports = router;