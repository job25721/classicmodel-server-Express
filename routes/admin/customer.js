const router = require('express').Router();
const Database = require("../../config/database");

router.get('/fetch', function(req, res, next) {
    Database.query(`select * from customers where salesRepEmployeeNumber = ${req.session.user}`, function(err, data) {
        if(data.length > 0) {
            console.log(data);
            console.log(req.session.user);
            
            
            res.json(data)
        }
        else res.json({permission : false})
        
    })
})

router.get('/changepage/:init', function(req, res, next) {
    var init = req.params.init
    Database.query(`select * from customers where salesRepEmployeeNumber = ${req.session.user} limit ${init},15`, function(err, data) {
        res.json(data)
    })
})

router.get('/detail/:customerNumber', function(req, res, next) {
    var customerNumber = req.params.customerNumber
    Database.query(`select * from customers where customerNumber = ${customerNumber}`, function(err, data) {
        res.json(data)
    })
})

router.post('/deleteCustomer/:id',function(req,res,next){
    console.log(req.params.id);
    var customerNumber = req.params.id
    Database.query(`Delete  from customers where customerNumber = ${customerNumber}`,(err,data)=>{
        res.send('ลุงตู่ได้ลบคุณออกจากทะเบียนราษฎรเรียบร้อยแล้ว')
    })

})

router.post('/addCustomer',function(req,res,next){
    code = req.body.CustomerQuery.code
    CusName = req.body.CustomerQuery.customername
    conFName = req.body.CustomerQuery.contactFirstname
    conLName = req.body.CustomerQuery.contactLastname
    phone = req.body.CustomerQuery.phone
    addressline1 = req.body.CustomerQuery.addressline1
    addressline2 = req.body.CustomerQuery.addressline2
    city = req.body.CustomerQuery.city
    state = req.body.CustomerQuery.state
    postalCode = req.body.CustomerQuery.postalCode
    country = req.body.CustomerQuery.country
    credit = req.body.CustomerQuery.credit
    
   console.log(` ${code}  ${CusName} ${conFName} ${conLName} ${phone}  ${addressline1} ${addressline2} ${city} ${state} ${postalCode} ${req.session.user} ${country} ${credit} `);
    Database.query(`INSERT INTO customers(customerNumber, customerName, contactLastName, contactFirstName, phone, addressLine1, addressLine2, city, state, postalCode, country, salesRepEmployeeNumber, creditLimit) VALUES (${code},'${CusName}','${conFName}','${conLName}','${phone}','${addressline1}','${addressline2}','${city}','${state}','${postalCode}','${country}',${req.session.user},${credit})`, function (err, data, fields) {
        console.log(err);
        res.json(data)
    });
})

module.exports = router;