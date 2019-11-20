const router = require('express').Router();
const Database = require("../../config/database");

router.get('/orderdetail', function(req, res, next) {
    Database.query(`select * from orders`, function(err, data) {
        console.log(data.length);

        res.json(data)
    })
})

router.get('/changepage/:init', function(req, res, next) {
    var init = req.params.init
    Database.query(`select * from orders limit ${init},15`, function(err, data) {
        res.json(data)
    })
})

router.get('/update/:value/:orderNumber', function(req, res, next) {
    var value = req.params.value
    var orderNumber = req.params.orderNumber
    Database.query(`update orders set status="${value}" where orderNumber=${orderNumber}`)
})

module.exports = router;