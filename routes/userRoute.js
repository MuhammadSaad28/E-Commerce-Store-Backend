const { register, login , forgotPassword, updateProfileController, getOrdersController, getAllOrdersController, updateOrderStatusController, getSpecificShopOrderController, updateUserStatusController } = require('../controllers/userController');
const { requireSignIn, isAdmin, isSuperAdmin } = require('../middlewares/Auth');
const router = require('express').Router();
const userModel = require('../models/userModel');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// protected route auth
router.get("/user-auth" , requireSignIn , (req,res) => {
    res.status(200).json({ ok: true});
})
router.get("/admin-auth" , requireSignIn , isAdmin , (req,res) => {
    res.status(200).json({ ok: true});
})
router.get("/super-admin-auth" , requireSignIn , isSuperAdmin , (req,res) => {
    res.status(200).json({ ok: true});
})

router.put("/profile" , requireSignIn , updateProfileController)

router.get('/orders', requireSignIn, getOrdersController);
router.get('/all-orders', requireSignIn, getAllOrdersController);
router.get('/specific-shop-order', requireSignIn, getSpecificShopOrderController)
router.put('/order-status/:orderId', requireSignIn, isAdmin, updateOrderStatusController );
router.put('/super-order-status/:orderId', requireSignIn, isSuperAdmin, updateOrderStatusController );
router.put('/user-status', requireSignIn, updateUserStatusController );

router.get('/get-all-sellers', requireSignIn, isSuperAdmin, async (req,res,next) => {
    try{
        const users = await userModel.find({role: 1});
        res.status(200).json(users);
    }catch(err){
        next(err)
    }
})

router.delete('/delete-user/:userId', requireSignIn, isSuperAdmin, async (req,res,next) => {
    try{
       const {userId} = req.params;
    //    console.log('Deleting user with ID:', userId);
         await userModel.findByIdAndDelete(userId);
            res.status(200).json({ ok: true});

    }catch(err){
        next(err)
    }
})

module.exports = router;