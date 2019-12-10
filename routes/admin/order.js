const router = require('express').Router();
const Database = require("../../config/database");

router.get('/fetch', function(req, res, next) {
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

router.get('/detail/:orderNumber', function(req, res, next) {
    var orderNumber = req.params.orderNumber
    Database.query(`select * from orders join orderdetails using (orderNumber) where orderNumber = ${orderNumber}`, function(err, data) {
        res.json(data)
    })
})

router.get('/delete/:pcode', function(req, res, next) {
    var pcode = req.params.pcode
    Database.query(`delete from products where productCode = '${pcode}'`)
})

router.get('/addproduct/:pcode/:pname/:pdesc/:pline/:pscale/:pvendor/:pquan/:pbuyprice/:pmsrp',
    function(req, res, next) {
        var pcode = req.params.pcode
        var pname = req.params.pname
        var pdesc = req.params.pdesc
        var pline = req.params.pline
        var pscale = req.params.pscale
        var pvendor = req.params.pvendor
        var pquan = req.params.pquan
        var pbuyprice = req.params.pbuyprice
        var pmsrp = req.params.pmsrp
        console.log(pline);
        Database.query(`insert into products (productCode,productName,productLine,productScale,productVendor,productDescription,quantityInStock,buyPrice,MSRP) 
        VALUES ('${pcode}','${pname}','${pline}','${pscale}','${pvendor}','${pdesc}',${pquan},${pbuyprice},${pmsrp})`)
    })

router.get('/update/:pcode/:pname/:pdesc/:pline/:pscale/:pvendor/:pquan/:pbuyprice/:pmsrp',
    function(req, res, next) {
        var pcode = req.params.pcode
        var pname = req.params.pname
        var pdesc = req.params.pdesc
        var pline = req.params.pline
        var pscale = req.params.pscale
        var pvendor = req.params.pvendor
        var pquan = req.params.pquan
        var pbuyprice = req.params.pbuyprice
        var pmsrp = req.params.pmsrp
        Database.query(`update products 
        set productCode = '${pcode}',productName = '${pname}',productLine = '${pline}',productScale='${pscale}',productVendor='${pvendor}',productDescription='${pdesc}',quantityInStock=${pquan},buyPrice=${pbuyprice},MSRP=${pmsrp}
        where productCode = '${pcode}'`)
    })
router.get('/checkout/:cno/:ceque/:required/:amount', function(req, res, next) {
    var cno = req.params.cno
    var ceque = req.params.ceque
    var required = req.params.required
    var amount = req.params.amount
    console.log(cno + ' ' + ceque + ' ' + required + ' ' + amount);
    // Database.query(`insert into (customerNumber,checkNumber,paymentDate,amount)
    // values ('${cno},${ceque},${required},${amount}')`)
})

module.exports = router;