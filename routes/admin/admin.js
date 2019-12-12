const router = require('express').Router();

router.use('/employee', require('./Employee'))
router.use('/discount', require('./discount'))
router.use('/product', require('./product'))
router.use('/preorder',require('./preorder'))
router.use('/preorderOrder',require('./preorderOrder'))
router.use('/order', require('./order'))
router.use('/customer', require('./customer'))

module.exports = router;