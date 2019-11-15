const router = require('express').Router();
const Database = require("../../config/database");

router.get('/employeeData',function(req,res,next){    
    var employeeNumber 
    if (req.session.user !== undefined) {
        employeeNumber = parseInt(req.session.user)
        Database.query(`select * from employees where reportsTo = ${employeeNumber}`, (err, data) => {
            res.json(data)
        })
    } else {
        res.end()
    }
})

router.get('/edit/:id',function (req,res,next) {
    req.session.editSESSION = req.params.id
        Database.query(`select * from employees where employeeNumber = ${req.session.editSESSION}` , (err, data) => {
            if (data.length > 0)
                res.json(data)
    })
})



module.exports = router;