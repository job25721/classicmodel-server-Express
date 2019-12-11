const router = require('express').Router();
const Database = require("../../config/database");

router.get('/getDiscount', function(req, res, next) {
    Database.query('SELECT DISTINCT discountNo,Code,Discount,TotalAmount,DATE_FORMAT(Expire,"%m-%d-%Y") as Expire FROM discounts', function(err, data, fields) {
        res.json(data);
    });
})

router.post('/addDiscount', function(req, res, next) {
    code = req.body.discountQuery.code.toString()
    discount = parseInt(req.body.discountQuery.discount)
    total = parseInt(req.body.discountQuery.total)
    expire = req.body.discountQuery.exp.toString()
    console.log(code);
    Database.query(`INSERT INTO discounts(Code, Discount, TotalAmount, Expire) VALUES("${code}",${discount},${total},"${expire}")`, function(err, data, fields) {
        console.log(err);
        res.json(data)
    });
})

router.delete('/deleteDiscount/:code', function(req, res, next) {
    discountCode = parseInt(req.params.code)
    Database.query(`DELETE FROM discounts WHERE discountNo = ${discountCode}`, function(err, data, fields) {
        console.log(err);
        res.end()
    });
})

router.get('/update/:dcode', function(req, res, next) {
    var dcode = req.params.dcode
    Database.query(`update discounts set TotalAmount=TotalAmount-1  where Code = "${dcode}"`)
})

module.exports = router;