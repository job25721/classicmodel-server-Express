const router = require('express').Router();
const Database = require("../../config/database");

router.get('/getDiscount',function (req,res,next) {
    //employeeNumber = parseInt(req.session.user)
    Database.query(`SELECT DISTINCT  customerNumber, customerName, phone, addressLine1, salesRepEmployeeNumber FROM customers WHERE salesRepEmployeeNumber = 1165`, function (err, data, fields) {
        res.json(data);
    });
})


router.delete('/deleteDiscount/:code',function(req,res,next){
    discountCode = parseInt(req.params.code)
    Database.query(`DELETE FROM discounts WHERE discountNo = ${discountCode}`, function (err, data, fields) {
        console.log(err);
        res.end()
    });
})

module.exports = router;