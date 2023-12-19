const userModel  = require('../models/userModel');
const orderModel  = require('../models/orderModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



module.exports.register = async (req, res, next) => {
  try{
       const { name, username, email, password, answer, address } = req.body;
       const usernameCheck = await userModel.findOne({ username });
       if(usernameCheck) return res.status(400).json({ message: 'Username already exists' , success: false});
       const emailCheck = await userModel.findOne({ email });
       if(emailCheck) return res.status(400).json({ message: 'Email already exists' , success: false});

        const hashedPassword = await bcrypt.hash(password, 10);
       
         const user = await userModel.create({ name, username, email, password: hashedPassword , answer, address });
         return res.status(200).json({ message: 'User Registered successfully', success: true, user });
  }catch(err){
    next(err)
  }
}


module.exports.login = async (req, res, next) => {
    try{
         const {email, password} = req.body;
         const user = await userModel.findOne({email});
         if(!user){
            return res.status(200).json({ message: 'Email is not Registered.', success: false});
         }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(200).json({ message: 'Incorrect Password.', success: false});
            }
            const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
            return res.status(200).json({ message: 'User Logged in successfully', success: true, user:{
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                address: user.address,
            },      
             token });
    }catch(err){
        next(err)
    }
}
module.exports.forgotPassword = async (req, res, next) => {
  try{
    const { email , answer , newPassword } = req.body; 
    if(!email){
      res.status(200).json({message: "Email is required" , success: false})
    }
    if(!answer){
      res.status(200).json({message: "Answer is required" , success: false})
    }
    if(!newPassword){
      res.status(200).json({message: "New Password is required" , success: false})
    }
    
    const user = await userModel.findOne({email,answer});
    if(!user){
      return  res.status(200).json({message: "Invalid Credentials" , success: false})
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(user._id , {password: hashedPassword});
    res.status(200).json({message: "Password Changed Successfully" , success: true})

  }catch(err){
    console.log(err);
    res.status(400).json({message: "Internal Server Error" , success: false , err})
    next(err)
  }
}

module.exports.updateProfileController = async (req, res, next) => {
  try{
    const { name , username , email , address } = req.body;
    console.log(req.body);
    console.log(req.user.id);
    const user = await userModel.findById(req.user.id);
    // if(!password && password.length < 6){
    //   res.status(200).json({message: "Password is required and should be 6 characters long" , success: false})
    // }
    // const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(req.user.id , {
      name: name || user.name,
      username: username || user.username,
      email: email || user.email,
      // password: hashedPassword || user.password,
      address: address || user.address
    } , {new: true});

    res.status(200).json({message: "Profile Updated Successfully" , success: true, user: updatedUser})
  }catch(err){
    console.log(err);
    res.status(400).json({message: "Internal Server Error" , success: false , err})
    next(err)
  }
}

module.exports.getOrdersController = async (req, res, next) => {
  try{
    console.log("UserId:",req.user.id);
    const orders = await orderModel.find({buyer: req.user.id}).populate('products','-photo').populate('buyer','name');
    console.log("Orders: ", orders);
    res.status(200).json(orders)
  }catch(err){
    console.log(err);
    res.status(400).json({message: "Internal Server Error" , success: false , err})
    next(err)
  }
}

module.exports.getAllOrdersController = async (req, res, next) => {
  try{
    const orders = await orderModel.find({}).populate('products','-photo').populate('buyer','name').sort({createdAt: -1});
    res.status(200).json(orders)
  }catch(err){
    console.log(err);
    res.status(400).json({message: "Internal Server Error" , success: false , err})
    next(err)
  }
}

module.exports.updateOrderStatusController = async (req, res, next) => {
  try{
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(orderId, {status} , {new: true});    
    res.status(200).json(order)
  }catch(err){
    console.log(err);
    res.status(400).json({message: "Internal Server Error" , success: false , err})
    next(err)
  }
}

module.exports.getSpecificShopOrderController = async (req,res,next) => {
  try{
     // Assuming you have the user ID in the request object

    // Fetch the user's created products
    const user = await userModel.findById(req.user.id).select('createdProducts');
    console.log(user);
    const createdProductIds = user.createdProducts;
    console.log(createdProductIds);

    // Fetch orders that include the created products
    const orders = await orderModel.find({
      'products': { $in: createdProductIds },
    })
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  }catch(err){
    console.log(err);
    res.status(400).json({message: "Internal Server Error" , success: false , err})
    next(err)
  }
}

module.exports.updateUserStatusController = async (req, res, next) => {
  try{
    const { name , username , email , address } = req.body;
    const user = await userModel.findById(req.user.id);
    

    const updatedUser = await userModel.findByIdAndUpdate(req.user.id , {
      name,
      username,
      email,
      address,
      role: 1
    } , {new: true});

    res.status(200).json({message: "Coongratulations. You are a Seller Now" , success: true, user: updatedUser})
  }catch(err){
    console.log(err);
    res.status(400).json({message: "Internal Server Error" , success: false , err})
    next(err)
  }
}
