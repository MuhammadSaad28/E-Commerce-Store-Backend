const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');


module.exports.requireSignIn = (req,res,next) => {
    try{
        
        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user = decode;
        next();
}catch(err){
    console.log(err);
}
}

module.exports.isAdmin = async (req,res,next) => {
    const user = await userModel.findById(req.user.id);
    if(user.role !== 1){
        return res.status(201).json({message:"Unauthorized Access" , success: false});
    }
    next();
}
module.exports.isSuperAdmin = async (req,res,next) => {
    const user = await userModel.findById(req.user.id);
    if(user.role !== 2){
        return res.status(201).json({message:"Unauthorized Access" , success: false});
    }
    next();
}