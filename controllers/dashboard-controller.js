const Product = require('../models/product-model');
const Shop = require('../models/shop-model');
const Category = require('../models/category-model');
const mongoose = require('mongoose');

module.exports.addProdPage = async (req, res) => {
    let categories = await Category.find();
    res.render("addProduct", {categories});
};

module.exports.addCatPage = async (req, res) => {
    res.render("addCategory");
};

module.exports.dashboardPage = async (req, res) => {
    res.render("dashboard");
};

module.exports.dashboardProdPage = async (req, res) => {
    let shopid = req.session.user.shopid;

    const limit = 5;
    const page = parseInt(req.query.page) || 1;
    const totalEntries = await Product.countDocuments();
    const totalPages = Math.ceil(totalEntries / limit);
    const startEntry = (page - 1) * limit + 1;
    const endEntry = Math.min(page * limit, totalEntries);

    const products = await Product.find({shop: shopid})
      .skip((page - 1) * limit)
      .limit(limit);

    res.render('dashboardProducts', {
      products,
      currentPage: page,
      totalPages,
      totalEntries,
      startEntry,
      endEntry
    });
};

module.exports.dashboardCatPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const shopId = new mongoose.Types.ObjectId(req.session.user.shopid); 

    const categories = await Product.aggregate([
      {
        $match: { shop: shopId } 
      },
      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",          // product.category (name)
          foreignField: "name",       // category.name
          as: "categoryDetails"
        }
      },
      {
        $unwind: "$categoryDetails"
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          productCount: 1,
          image: "$categoryDetails.image",
          status: "$categoryDetails.status"
        }
      },
      {
        $sort: { productCount: -1 } // optional: sort by count
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalCountAgg = await Product.aggregate([
      { $match: { shop: shopId } },
      {
        $group: {
          _id: "$category"
        }
      },
      { $count: "total" }
    ]);

    const total = totalCountAgg[0]?.total || 0;

    // Prepare pagination values
    const totalPages = Math.ceil(total / limit);
    const showingFrom = skip + 1;
    const showingTo = skip + categories.length;
  
    res.render("dashboardCategories", {
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        showingFrom,
        showingTo
      }
    });
};

module.exports.addProducts = async (req, res) => {
    try {
        console.log(req.session.user.shopid);
        const {
            name,
            category,
            weight,
            quantity,
            status,
            reg_price,
            sale_price,
            description
          } = req.body;

          const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
          
          const newProduct = new Product({
            name,
            category,
            weight,
            quantity,
            status: status === 'true', // convert to boolean
            reg_price,
            sale_price,
            description,
            shop: req.session.user.shopid,
            images: imagePaths
          });
      
          await newProduct.save();

          let newShop = await Shop.findOneAndUpdate(
            { ownerid: req.session.user.useid },            // find by owner field
            { $push: { products: newProduct._id } },      // push product ID
            { new: true }                                 // return the updated document
          );

          res.status(201).json({ "success": true, "message" : 'Product created successfully'});
    } catch(err) {
        console.error("Error Occured creating product : ",err);
        return res.status(500).json({"success":false,"message": "Something went wrong.."});
    }
};

module.exports.addCategory = async (req, res) => {
  try{
    const { category_name, description, date, status } = req.body;
    const image = req.file.filename;

    if (!category_name || !description || !date || !image) {
      return res.status(400).json({ "success": false, "message": 'Missing required fields' });
    }

    let newCategory = await Category.create({
      name: category_name,
      image: `/uploads/category/${image}`,
      status,
      description,
      date
    });

    res.status(201).json({ "success": true, "message" : 'Category created successfully'});

  }catch(err) {
    console.error("Error Occured creating category : ",err);
    return res.status(500).json({"success":false,"message": "Something went wrong.."});
  }
};