const router = require('express').Router();
const Database = require("../../config/database");

router.get('/fetch', function(req, res, next) {
    Database.query(`select * from customers`, function(err, data) {
        console.log(data.length);
        res.json(data)
    })
})

router.get('/changepage/:init', function(req, res, next) {
    var init = req.params.init
    Database.query(`select * from customers limit ${init},15`, function(err, data) {
        res.json(data)
    })
})

router.get('/detail/:customerNumber', function(req, res, next) {
    var customerNumber = req.params.customerNumber
    Database.query(`select * from customers where customerNumber = ${customerNumber}`, function(err, data) {
        res.json(data)
    })
})

module.exports = router;