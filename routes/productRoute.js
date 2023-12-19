const router = require('express').Router();
const { requireSignIn, isAdmin, isSuperAdmin } = require('../middlewares/Auth');
const { createProductController, getProductController, getSingleProductController, productPhotoController, updateProductController, deleteProductController, getFiltersController, getCategoryFiltersController, getPriceFiltersController, productCountController, ProductListController, searchProductController, relatedProductController, getProductByCategoryController, braintreeTokenController, braintreePaymentController, getSpecificProductController, createSuperProductController } = require('../controllers/productController');
const formidable = require('express-formidable');


router.post('/create-product', requireSignIn, isAdmin,formidable() , createProductController);
router.post('/create-super-product', requireSignIn, isSuperAdmin,formidable() , createSuperProductController);
router.get('/get-products', getProductController);
router.get('/get-specific-products', requireSignIn ,getSpecificProductController);
router.get('/get-product/:slug', getSingleProductController);
router.get('/product-photo/:pid', productPhotoController);
router.put('/update-product/:id', requireSignIn, isAdmin,formidable(), updateProductController);
router.put('/update-super-product/:id', requireSignIn, isSuperAdmin,formidable(), updateProductController);
router.delete('/delete-product/:id', requireSignIn, isAdmin, deleteProductController);
router.delete('/delete-super-product/:id', requireSignIn, isSuperAdmin, deleteProductController);

router.post('/product-filters', getFiltersController)
router.post('/product-category-filters', getCategoryFiltersController)
router.post('/product-price-filters', getPriceFiltersController)

router.get('/product-count', productCountController)

router.get('/product-list/:page', ProductListController)


router.get('/search/:keyword', searchProductController)

router.get('/related-product/:pid/:cid', relatedProductController)

router.get('/product-category/:slug', getProductByCategoryController)

router.get('/braintree/token', braintreeTokenController)
router.post('/braintree/payment', requireSignIn, braintreePaymentController)









module.exports = router;