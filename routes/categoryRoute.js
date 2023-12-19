const router = require('express').Router();
const { requireSignIn, isAdmin, isSuperAdmin } = require('../middlewares/Auth');
const { createCategoryController,updateCategoryController,allCategoryController,singleCategoryController, deleteCategoryController, createSuperCategoryController, updateSuperCategoryController, deleteSuperCategoryController } = require('../controllers/categoryController');

router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
router.post('/create-super-category', requireSignIn, isSuperAdmin, createSuperCategoryController);
router.get('/get-category', allCategoryController);
router.get('/single-category/:slug', singleCategoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);
router.put('/update-super-category/:id', requireSignIn, isSuperAdmin, updateSuperCategoryController);
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);
router.delete('/delete-super-category/:id', requireSignIn, isSuperAdmin, deleteSuperCategoryController);



module.exports = router;