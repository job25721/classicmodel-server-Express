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
router.get('/payment/:amount/:cno/:ceque', function(req, res, next) {
    var cno = req.params.cno
    var ceque = req.params.ceque
    var amount = req.params.amount
    if (ceque == 'No ceque') ceque = null
    Database.query(`insert into payments(customerNumber,checkNumber,paymentDate,amount)
    values (${cno},'${ceque}',CURRENT_TIMESTAMP,${amount})`)
})

router.get('/checkout/:reqdate/:cno/:orderno', function(req, res, next) {
    var reqdate = req.params.reqdate
    var cno = req.params.cno
    var orderno = req.params.orderno
    if (reqdate == "null") {
        Database.query(`insert into orders(orderNumber,orderDate,requiredDate,shippedDate,status,comments,customerNumber)
        values (${orderno},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP+1,null,"In Process",null,${cno})`, function(err, data) {
            res.json(data)
        })
    } else {
        Database.query(`insert into orders(orderNumber,orderDate,requiredDate,shippedDate,status,comments,customerNumber)
        values (${orderno},CURRENT_TIMESTAMP,"${reqdate}",null,"In Process",null,${cno})`, function(err, data) {
            res.json(data)
        })
    }

})

router.get('/getorderNo', function(req, res, next) {
    Database.query(`select max(orderNumber) as orderNo from orders`, function(err, data) {
        res.json(data)
    })
})

router.get('/detail/insert/:orderno/:code/:quantity/:price/:i', function(req, res, next) {
    var orderno = req.params.orderno
    var pcode = req.params.code
    var quan = req.params.quantity
    var price = req.params.price
    var i = req.params.i
    console.log("im " + quan);
    Database.query(`insert into orderdetails(orderNumber,productCode,quantityOrdered,priceEach,orderLineNumber)
    values (${orderno},'${pcode}',${quan},${price},${i})`)
    Database.query(`update products set quantityInStock = quantityInStock-${quan} where productCode = '${pcode}'`)
})

router.get('/getpoint/:cno/:point', function(req, res, next) {
    var cno = req.params.cno
    var point = req.params.point
    Database.query(`update customers set totalPoint = totalPoint + ${point} where customerNumber = ${cno}`)
})

router.get('/editdetail/:comment/:orderno', function(req, res, next) {
    var comment = req.params.comment
    var orderno = req.params.orderno
    console.log(comment);
    Database.query(`update orders set comments = ${comment} where orderNumber = ${orderno}`)
})

module.exports = router;