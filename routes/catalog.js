const router = require('express').Router();
const Database = require("../config/database");

router.get('/scaleFilter', function(req, res, next) {
    Database.query('SELECT DISTINCT productScale FROM products', function(err, data, fields) {
        res.json(data);
    });
})

router.get('/vendorFilter', function(req, res, next) {
    Database.query('SELECT DISTINCT productVendor FROM products', function(err, data, fields) {
        res.json(data);
    });
})

router.get('/fetchPopUp/:productCode', function(req, res, next) {
    var code = req.params.productCode
    Database.query('SELECT * FROM `products` JOIN `productlines` USING (productLine) where productCode = ? ', [code], function(err, result, fields) {
        res.json(result)
    })
})

router.get('/allproduct', function(req, res, next) {

    Database.query(`select * from products join productlines USING (productLine)`, function(err, result, fields) {
        res.json({
            result: result,
            row: result.length
        })
    })
})

router.get('/preorder', function(req, res, next) {

    Database.query(`select * from products join productlines USING (productLine) where quantityInStock = 0`, function(err, result, fields) {
        res.json({
            result: result,
            row: result.length
        })
    })
})

router.get('/test/:scale/:vendor/:name/:init', function(req, res, next) {
    var scale = req.params.scale
    var vendor = req.params.vendor
    var name = req.params.name
    var init = req.params.init
    var filter = ""
    if (name == "undefined") {
        if (scale == "All" && vendor == "All") filter = ""
        else if (scale == "All" && vendor != "All") filter = 'where productVendor = "' + vendor + '"'
        else if (scale != "All" && vendor == "All") filter = 'where productScale = "' + scale + '"'
        else filter = 'where productScale = "' + scale + '" and productVendor="' + vendor + '"'
    } else {
        if (scale == "All" && vendor == "All") filter = 'where productName="' + name + '"'
        else if (scale == "All" && vendor != "All") filter = 'where productVendor = "' + vendor + '"and productName="' + name + '"'
        else if (scale != "All" && vendor == "All") filter = 'where productScale = "' + scale + '"and productName="' + name + '"'
        else filter = 'where productScale = "' + scale + '" and productVendor="' + vendor + '"and productName="' + name + '"'
    }
    Database.query(`select * from products join productlines USING (productLine) ${filter} limit ${init},18`, function(err, result, fields) {
        res.json({
            result: result,
            row: result.length
        })
    })
})

router.get('/product/:scale/:vendor/:name', function(req, res, next) {
    var scale = req.params.scale
    var vendor = req.params.vendor
    var name = req.params.name
    var filter = ""
    if (name == "All") {
        if (scale == "All" && vendor == "All") filter = ""
        else if (scale == "All" && vendor != "All") filter = 'where productVendor = "' + vendor + '"'
        else if (scale != "All" && vendor == "All") filter = 'where productScale = "' + scale + '"'
        else filter = 'where productScale = "' + scale + '" and productVendor="' + vendor + '"'
    } else {
        if (scale == "All" && vendor == "All") filter = 'where productName like "' + name + '%"'
        else if (scale == "All" && vendor != "All") filter = 'where productVendor = "' + vendor + '"and productName like "%' + name + '%"'
        else if (scale != "All" && vendor == "All") filter = 'where productScale = "' + scale + '"and productName like "%' + name + '%"'
        else filter = 'where productScale = "' + scale + '" and productVendor="' + vendor + '"and productName like "%' + name + '%"'
    }
    Database.query(`select * from products join productlines USING (productLine) ${filter} `, function(err, result, fields) {
        res.json({
            result: result,
            row: result.length
        })
    })
})

module.exports = router;