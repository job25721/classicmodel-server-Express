var express = require('express');
var router = express.Router();
var Database = require('../config/database')

var bcrypt = require("bcryptjs");
const saltRounds = 5;
/* GET home page. */
router.get('/', function(req, res, next) {
  Database.query('SELECT * from users',(err,data)=>{
    res.json(data);
  })
  
});

router.post('/add',function(req,res,next){
  const id = req.body.user.input;
  const pass = req.body.user.pass;
  console.log(id);
        Database.query('SELECT employeeNumber FROM employees WHERE employeeNumber = ' + id, (err, data) => {
            if (data.length > 0) {
                Database.query('SELECT employeeNumber FROM users WHERE employeeNumber = ' + id, (err, data2) => {
                    if (data2.length > 0) {
                        res.json({"exist":true,"can":false});
                    } else {
                        bcrypt.hash(pass, saltRounds, function (err, hash) {
                            Database.query('INSERT INTO users(employeeNumber,pswd) VALUES(' + id + ',' + '"' + hash + '"' + ')')
                        });
                        res.json({"exist":false ,"can":true});
                    }
                })

            } else {
                res.json({"exist":false,"can":false});
            }
        });
})

router.delete('/delete/:id',function(req,res,next){
  console.log(req.params.id);
  Database.query('DELETE from users where employeeNumber = ' + parseInt(req.params.id))
    res.end()
})

module.exports = router;