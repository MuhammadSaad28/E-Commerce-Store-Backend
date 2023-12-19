const Category = require('../models/categoryModel')
const slugify = require('slugify');

module.exports.createCategoryController = async (req, res, next) => {
   try{
        const {name} = req.body;
        if(!name){
            return res.status(200).json({message: "Name is required" , success: false})
        }
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(200).json({message: "Category already exists" , success: false})
        }
        const category = await new Category({name, slug:slugify(name)}).save();
        res.status(201).json({message: "Category created successfully" , success: true , category})
   }catch(err){
       next(err);
   }
}

module.exports.createSuperCategoryController = async (req, res, next) => {
    try{
         const {name} = req.body;
         if(!name){
             return res.status(200).json({message: "Name is required" , success: false})
         }
         const existingCategory = await Category.findOne({name});
         if(existingCategory){
             return res.status(200).json({message: "Category already exists" , success: false})
         }
         const category = await new Category({name, slug:slugify(name)}).save();
         res.status(201).json({message: "Category created successfully" , success: true , category})
    }catch(err){
        next(err);
    }
 }

module.exports.updateCategoryController = async (req, res, next) => {
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await Category.findOneAndUpdate({_id:id}, {name, slug:slugify(name)}, {new: true});
        if(!name){
            return res.status(200).json({message: "Name is required" , success: false})
        }
        res.status(201).json({message: "Category updated successfully" , success: true , category})
   }catch(err){
       next(err);
   }
}
module.exports.updateSuperCategoryController = async (req, res, next) => {
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await Category.findOneAndUpdate({_id:id}, {name, slug:slugify(name)}, {new: true});
        if(!name){
            return res.status(200).json({message: "Name is required" , success: false})
        }
        res.status(201).json({message: "Category updated successfully" , success: true , category})
   }catch(err){
       next(err);
   }
}

module.exports.allCategoryController = async (req, res, next) => {
    try{
        const categories = await Category.find({});
        res.status(201).json({message: "Categories fetched successfully" , success: true , categories})
   }catch(err){
       next(err);
   }
}

module.exports.singleCategoryController = async (req, res, next) => {
    try{
        const {slug} = req.params;
        const category = await Category.findOne({slug});
        res.status(201).json({message: "Category fetched successfully" , success: true , category})
   }catch(err){
       next(err);
   }
}

module.exports.deleteCategoryController = async (req, res, next) => {
    try{
        const {id} = req.params;
        const category = await Category.findOneAndDelete({_id:id});
        res.status(201).json({message: "Category deleted successfully" , success: true , category})
   }catch(err){
       next(err);
   }
}
module.exports.deleteSuperCategoryController = async (req, res, next) => {
    try{
        const {id} = req.params;
        const category = await Category.findOneAndDelete({_id:id});
        res.status(201).json({message: "Category deleted successfully" , success: true , category})
   }catch(err){
       next(err);
   }
}