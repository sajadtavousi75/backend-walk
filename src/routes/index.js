const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const categoryRouter = require('./category');
const productRouter = require('./product');
const commentRouter = require('./comment');
const isAdminMiddleware = require("../middlewares/isAdmin");
const isAuthenticated = require("../middlewares/authenticated");
const isLoggined = require("../middlewares/loginUser");





router.use('/auth', authRouter);

router.use('/user', isLoggined, userRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/comment', commentRouter);



module.exports = router; 
