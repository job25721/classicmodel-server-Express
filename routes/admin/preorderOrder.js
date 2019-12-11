const router = require('express').Router()
const Database = require('../../config/database')


router.get('/checkout/:reqdate/:cno/:orderno', function(req, res, next) {
    var reqdate = req.params.reqdate
    var cno = req.params.cno
    var orderno = req.params.orderno
    if (reqdate == "null") {
        Database.query(`insert into preorders(orderNumber,orderDate,requiredDate,shippedDate,status,comments,customerNumber)
        values (${orderno},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP+7,null,"In Process",null,${cno})`, function(err, data) {
            res.json(data)
        })
    } else {
        Database.query(`insert into preorders(orderNumber,orderDate,requiredDate,shippedDate,status,comments,customerNumber)
        values (${orderno},CURRENT_TIMESTAMP,"${reqdate}",null,"In Process",null,${cno})`, function(err, data) {
            res.json(data)
        })
    }

})

router.get('/detail/insert/:orderno/:code/:quantity/:price/:i', function(req, res, next) {
    var orderno = req.params.orderno
    var pcode = req.params.code
    var quan = req.params.quantity
    var price = req.params.price
    var i = req.params.i
    console.log("im " + quan);
    Database.query(`insert into preorderdetails(orderNumber,productCode,quantityOrdered,priceEach,orderLineNumber)
    values (${orderno},'${pcode}',${quan},${price},${i})`)
})

router.get('/getorderNo', function(req, res, next) {
    Database.query(`select max(orderNumber) as orderNo from preorders`, function(err, data) {
        res.json(data)
    })
})


module.exports = router;