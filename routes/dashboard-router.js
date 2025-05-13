const express = require('express');
const dashboardController = require('../controllers/dashboard-controller');
const router = express.Router();
const product_upload = require('../config/product-multer-setup');
const category_upload = require('../config/category-multer-setup');
const loginRequired = require('../middlewares/login_required');

// Pages :
router.get('/add-category', loginRequired ,dashboardController.addCatPage);
router.get('/add-product', loginRequired , dashboardController.addProdPage);
router.get('/products', loginRequired, dashboardController.dashboardProdPage);
router.get('/categories', loginRequired, dashboardController.dashboardCatPage);
router.get('/', loginRequired, dashboardController.dashboardPage);

// uploading data with images : 
router.post('/addProduct', product_upload.array("images", 10), dashboardController.addProducts);
router.post('/addCategory', category_upload.single('image'), dashboardController.addCategory);

module.exports = router;