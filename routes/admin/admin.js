const router = require('express').Router();
const isAuten = require('../../Middleware/isAuthen')

//router.use(isAuten)

router.use('/employee', require('./Employee'))
router.use('/discount', require('./discount'))
router.use('/product', require('./product'))
router.use('/preorder',require('./preorder'))
router.use('/order', require('./order'))
router.use('/customer', require('./customer'))

module.exports = router;