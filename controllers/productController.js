const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const fs = require('fs');
const slugify = require('slugify');
require('dotenv').config();
var braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });



module.exports.createProductController = async (req, res, next) => {
    try {
        const { name, price, description, category, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name: return res.json({ 
                success: false,
                message: 'Name is required'
             });
            case !price: return res.json({
                success: false,
                message: 'Price is required'
            });
            case !description: return res.json({
                success: false,
                message: 'Description is required'
            });
            
            case !category: return res.json({
                success: false,
                message: 'Category is required'
            });
            case !shipping: return res.json({
                success: false,
                message: 'Shipping is required'
            });
            case !photo: return res.json({
                success: false,
                message: 'Photo is required'
            });
            case photo && photo.size > 1000000: return res.json({
                success: false,
                message: 'Photo should be less than 1mb in size'
            });
        }
        const product = new productModel({
            ...req.fields, slug: slugify(name), createdBy: req.user.id
        });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        await userModel.findByIdAndUpdate(
            req.user.id,
            { $push: { createdProducts: product._id } },
            { new: true }
        );
        res.json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};
module.exports.createSuperProductController = async (req, res, next) => {
    try {
        const { name, price, description, category, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name: return res.json({ 
                success: false,
                message: 'Name is required'
             });
            case !price: return res.json({
                success: false,
                message: 'Price is required'
            });
            case !description: return res.json({
                success: false,
                message: 'Description is required'
            });
            
            case !category: return res.json({
                success: false,
                message: 'Category is required'
            });
            case !shipping: return res.json({
                success: false,
                message: 'Shipping is required'
            });
            case !photo: return res.json({
                success: false,
                message: 'Photo is required'
            });
            case photo && photo.size > 1000000: return res.json({
                success: false,
                message: 'Photo should be less than 1mb in size'
            });
        }
        const product = new productModel({
            ...req.fields, slug: slugify(name), createdBy: req.user.id
        });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        await userModel.findByIdAndUpdate(
            req.user.id,
            { $push: { createdProducts: product._id } },
            { new: true }
        );
        res.json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getProductController = async (req, res, next) => {
    try {
        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({ createdAt: -1 });
        res.json({
            success: true,
            products
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSpecificProductController = async (req, res, next) => {
    try{
        // Get user ID from the request, you may have to adjust this based on your authentication setup
    const userId = req.user.id; // Assuming you have the user ID in the request object

    // Fetch the user's created products
    const user = await userModel.findById(userId).select('createdProducts');
    const createdProductIds = user.createdProducts;

    

    // Fetch only the user's created products
    const userCreatedProducts = await productModel.find({
      '_id': { $in: createdProductIds },
    })
      .populate('category')
      .select('-photo')
      .limit(12)
      .sort({ createdAt: -1 });

    

    res.json({ success: true, products: userCreatedProducts });
    }catch(err){
        next(err);
    }
}


module.exports.getSingleProductController = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await productModel.findOne({ slug:slug }).select('-photo').populate('category');
        res.json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

module.exports.productPhotoController = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
          res.set("Content-type", product.photo.contentType);
          return res.status(200).send(product.photo.data);
        }
        
    } catch (error) {
        next(error);
    }
};

module.exports.updateProductController = async (req, res, next) => {
    try {
        const { name, price, description, category, shipping } = req.fields;
        const id = req.params.id;
        const product = await productModel.findById(id);
        if (!product) {
            return res.json({
              success: false,
              message: 'Product not found',
            });
          }

          

        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.shipping = shipping;
        product.slug = slugify(name);


        await product.save();


        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteProductController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findByIdAndDelete(id).select('-photo');


        await userModel.findByIdAndUpdate(
            product.createdBy,
            { $pull: { createdProducts: id } },
            { new: true }
        ); 

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};



module.exports.getFiltersController = async (req, res, next) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
  
      if (checked.length > 0) {
        args.category = checked;
        console.log(args.category);
      }
  
      if (radio && radio.length > 0) {
        args.price = {
          $gte: radio[0],
          $lte: radio[1]
        };
        console.log(args.price);
      }
  
      const products = await productModel.find(args);
      res.status(200).json({
        success: true,
        products
      });
    } catch (error) {
      next(error);
    }
  };

module.exports.getCategoryFiltersController = async (req, res, next) => {
    try {
        const { checked } = req.body;
        let args = {};
        if(checked.length > 0) {
            args.category = checked;
        }
        const products = await productModel.find(args);
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        next(error);
    }
}

module.exports.getPriceFiltersController = async (req, res, next) => {
    try {
        const { radio } = req.body;
        let args = {};
        if(radio.length){
            args.price = {
                $gte: radio[0],
                $lte: radio[1]
            }
        }
        const products = await productModel.find(args);
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        next(error);
    }
}

module.exports.productCountController = async (req, res, next) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).json({
            success: true,
            total,
        });
    } catch (error) {
        next(error);
    }
}

module.exports.ProductListController = async (req, res, next) => {
    try {
        const perPage = 9;
        const page = req.params.page || 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        next(error);
    }
}

module.exports.searchProductController = async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({ $or: [{ name: { $regex: keyword, $options: 'i' } }, { description: { $regex: keyword, $options: 'i' } }] }).select("-photo");
        res.status(200).json({
            success: true,
            results
        });
    } catch (error) {
        next(error);
    }
}


module.exports.relatedProductController = async (req, res, next) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({ _id: { $ne: pid }, category: cid }).select('-photo').limit(4).populate('category');
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        next(error);
    }
}
 

module.exports.getProductByCategoryController = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug });
        if (!category) {
            return res.status(200).json({
                success: false,
                message: 'Category not found'
            });
        }
        const products = await productModel.find({ category: category._id }).populate('category');
        res.status(200).json({
            success: true,
            category,
            products
        });
    } catch (error) {
        next(error);
    }
}

module.exports.braintreeTokenController = async (req, res, next) => {
    try{
       gateway.clientToken.generate({}, function (err, response) {
           if(err){
               res.status(500).send(err)
            }else{
            
            res.send(response);
        }
       })
    }catch(error){
        next(error);
    }
}
module.exports.braintreePaymentController = async (req, res, next) => {
    try{
        // console.log(req.user.id)
    //   const { cart,nonce } = req.body;
    //   let total = 0;
    //   cart.map( (i) => {
    //     total += i.price
    // });
    // let newTransaction = gateway.transaction.sale({
    //     amount: total,
    //     paymentMethodNonce: nonce,
    //     options:{
    //         submitForSettlement:true
    //     }
    // },
    //    function(error,result){
    //     if(result){
    //         const order = new orderModel({
    //             products: cart,
    //             payment: result,
    //             buyer: req.user.id
    //         }).save()
    //         res.json({ok:true})
    //     }else{
    //         res.status(500).send(error)
    //     }
    //    }
    // );

    const { cart, nonce } = req.body;

        // Iterate through each product in the cart and create a separate order for each
        const orderPromises = cart.map(async (product) => {
            const total = product.price;

            // Create a new transaction for the current product
            const newTransaction = await gateway.transaction.sale({
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            });

            // Create a new order document for the current product
            const order = new orderModel({
                products: [product._id], // Assuming product._id is the ID of the product
                payment: newTransaction,
                buyer: req.user.id,
                status: 'Not Processed',
            });

            // Save the order document to the database
            return order.save();
        });

        // Wait for all orders to be created and saved
        const orders = await Promise.all(orderPromises);

        res.json({ success: true, orders });
    }catch(error){
        next(error);
    }
}







  

