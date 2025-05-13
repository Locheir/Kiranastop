const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const shopModel = require('../models/shop-model');

module.exports.DemoPage = function(req, res) {
    res.send("It's working");
};

module.exports.customerSignUp = function(req, res) {
    res.render('custSignup');
};

module.exports.shopkeeperSignUp = function(req, res) {
    res.render('shopSignup');
};

module.exports.LoginPage = async function(req, res) {
    res.render("login");
};

module.exports.forgotPassPage = async function(req, res) {
    res.render("forgotPassword");
};

module.exports.resetPassPage = async function(req, res) {
    res.render("resetPassword");
};

module.exports.createUser = async function(req, res) {
    // let salt = await bcrypt.genSalt(10);
    // let encrypt = await bcrypt.hash("iloveyou", salt);
    // let result = await bcrypt.compare("iloveyou", encrypt);

    let {fname, lname, email, contact, location, password, address, role} =req.body;

    const name = `${fname} ${lname}`;

    try {
        let user = await userModel.findOne({email});

        if (user) {
            console.log("User Already Exists");
            return res.status(400).json({"success":false ,"message":"Your Account Already exists, please Login"});
        }

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        user = await userModel.create({
            name,
            email,
            role,
            contact,
            location,
            password: hash
        });

        let token = generateToken({email});

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30*24*60*60*1000,
        });

        if (user.role == 'shopkeeper') {
            let shop = await shopModel.create({
                name: req.body.shopname,
                address: address,
                location: location,
                ownerId: user._id,
            });

            req.session.user = {
                userid : user._id,
                shopid : shop._id
            };
        } else {
            req.session.user = {
                userid : user._id
            };
        }

        return res.status(201).json({"success": true , "message": "User Created Successfully", "role": user.role});
    } catch(err) {
        console.error("Error Occured while creating user : ",err);
        return res.status(500).json({"success":false, "message": "Something went wrong.."});
    }
};

module.exports.loginIn = async function(req, res) {
    try {

        let {email, password} = req.body;
        let user = await userModel.findOne({email});

        if (!user) {
            console.log("email incorrect");
            return res.status(400).json({"success": false, message:"Email is Incorrect."});
        }

        let checkPass = await bcrypt.compare(password, user.password);

        if (!checkPass) {
            console.log("incorrect password");
            return res.status(400).json({"success": false, message:"Incorrect Password."});
        }

        let token = generateToken({email});

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30*24*60*60*1000,
        });

        if (user.role == 'shopkeeper') {

            let shop = await shopModel.findOne({ownerId: user._id});
            
            req.session.user = {
                userid : user._id,
                shopid : shop._id
            };
        } else {
            req.session.user = {
                userid : user._id
            };
        }

        return res.status(200).json({"success":true, message:"Login in Successfull.", "role":user.role});
    } catch(err) {
        console.error("Error Occured while loginin user : ",err);
        return res.status(500).json({"success":false,"message": "Something went wrong.."});
    }
};

module.exports.logOut = async function(req, res) {
    res.cookie("token",'');
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.redirect('/'); 
        }
    });
    res.redirect('/');
};

module.exports.resetPassRequest = async function(req, res) {
    const { email } = req.body;

    let user = await userModel.findOne({email});

    if (!user) {
        return res.status(400).json({"success":false, "message": "User with Email was not Found"});
    }

    let resetLink = `http://localhost:${process.env.PORT}/reset-password`

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"KiranaStop" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click the link to reset your password: <a href="${resetLink}"> reset </a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.cookie("reset", user._id, {
            httpOnly: true,
            maxAge: 30*60*1000,
        });
        res.status(200).json({"success":true, "message": "Reset link send to Email"});
    } catch (error) {
        console.error(error);
        res.status(500).json({"success":false, "message": "Something went wrong"});
    }
};

module.exports.resetPassword = async function(req, res) {
    try {
        let {password} = req.body;

        console.log("here");

        let user = await userModel.findOne({_id: req.cookies.reset});

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        user.password = hash;
        
        await user.save();

        res.cookie("reset",'');

        return res.status(200).json({"success":true, "message": "Password set successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({"success":false, "message": "Something went wrong"});
    }
    
};