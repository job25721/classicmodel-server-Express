const router = require('express').Router();
const isAuten = require('../../Middleware/isAuthen')

//router.use(isAuten)

router.use('/employee', require('./Employee'))
router.use('/discount', require('./discount'))
router.use('/product', require('./product'))
router.use('/order', require('./order'))


module.exports = router;