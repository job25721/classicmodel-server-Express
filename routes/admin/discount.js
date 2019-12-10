const router = require('express').Router();
const Database = require("../../config/database");

router.get('/getDiscount',function (req,res,next) {
    Database.query('SELECT DISTINCT discountNo,Code,Discount,TotalAmount,Expire FROM discounts', function (err, data, fields) {
        res.json(data);
    });
})

router.post('/addDiscount',function(req,res,next){
    code = req.body.discountQuery.code
    discount = parseInt(req.body.discountQuery.discount)
    total = parseInt(req.body.discountQuery.total)
    expire = req.body.discountQuery.exp.toString()
    console.log(code);
    Database.query(`INSERT INTO discounts(Code, Discount, TotalAmount, Expire) VALUES(${code},${discount},${total},${expire})`, function (err, data, fields) {
        console.log(err);
        res.json(data)
    });
})

router.delete('/deleteDiscount/:code',function(req,res,next){
    discountCode = parseInt(req.params.code)
    Database.query(`DELETE FROM discounts WHERE discountNo = ${discountCode}`, function (err, data, fields) {
        res.end()
    });
})

module.exports = router;