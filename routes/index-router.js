const express = require('express');
const indexController = require('../controllers/index-controller');
const router = express.Router();

router.get("/", indexController.DemoPage);

// Signing In :
router.get("/customerSignup", indexController.customerSignUp);
router.get("/shopkeeperSignup", indexController.shopkeeperSignUp)
router.post("/signup/createuser", indexController.createUser);

// Loging In : 
router.get("/login", indexController.LoginPage);
router.post("/loginin", indexController.loginIn);
router.get("/logout", indexController.logOut);

// Reseting Password :
router.get("/forgotPassword", indexController.forgotPassPage);
router.post("/forgot", indexController.resetPassRequest);
router.get("/reset-password", indexController.resetPassPage);
router.patch("/reset", indexController.resetPassword);

module.exports = router;