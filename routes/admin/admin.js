const router = require('express').Router();
const isAuten = require('../../Middleware/isAuthen')

//router.use(isAuten)

router.use('/employee', require('./Employee'))
router.use('/discount', require('./discount'))
router.use('/product', require('./product'))
router.use('/order', require('./order'))
router.use('/customer', require('./customer'))
router.use('/discount1', require('./discount1'))
module.exports = router;