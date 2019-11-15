const router = require('express').Router();
const Database = require("../config/database");

router.get('/scaleFilter',function (req,res,next) {
    Database.query('SELECT DISTINCT productScale FROM products', function (err, data, fields) {
        res.json(data);
    });
})

router.get('/vendorFilter',function (req,res,next) {
    Database.query('SELECT DISTINCT productVendor FROM products', function (err, data, fields) {
        res.json(data);
    });
})

router.get('/fetchPopUp/:productCode',function (req,res,next) {
    var code = req.params.productCode
    Database.query('SELECT * FROM `products` JOIN `productlines` USING (productLine) where productCode = ? ', [code], function (err, result, fields) {
        res.json( result)
    })
})
router.get('/getData',function (req,res,next) {
        var scale = req.query.scale;
        var vendor = req.query.vendor; 
        console.log(scale);
        
        if ((scale === undefined && vendor === undefined) || (scale === "All" && vendor === "All")) {
            Database.query('SELECT * FROM `products` JOIN `productlines` USING (productLine)', function (err, result, fields) {

                res.json({
                    result: result,
                    rowNum: result.length
                })
            });
        } else if (scale === "All" && vendor !== "All") {
            Database.query('SELECT * FROM `products` JOIN `productlines` USING (productLine) where productVendor = ?', vendor, function (err, result, fields) {

                res.json({
                    result: result,
                    rowNum: result.length
                })
            })
        } else if (scale !== "All" && vendor === "All") {
            Database.query('SELECT * FROM `products` JOIN `productlines` USING (productLine) where productScale = ?', scale, function (err, result, fields) {

                res.json({
                    result: result,
                    rowNum: result.length
                })
            })
        } else {
            Database.query('SELECT * FROM `products` JOIN `productlines` USING (productLine) where productScale = ? and productVendor = ?', [scale, vendor], function (err, result, fields) {

                res.json({
                    result: result,
                    rowNum: result.length
                })
            })
        }
})
module.exports =  router ;