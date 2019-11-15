var express = require('express');
var router = express.Router();
var Database = require('../config/database')
/* GET home page. */
router.get('/', function(req, res, next) {
  Database.query('SELECT * from users',(err,data)=>{
    res.json(data);
  })
  
});

router.post('/add',function(req,res,next){
  console.log(req.body.user.input);
  Database.query('INSERT INTO users(employeeNumber) VALUES(' +parseInt(req.body.user.input) +')',(err,data)=>{
    if(err === null) res.json({status : true})
    else res.json({status : false})
    
  })
})

router.delete('/delete/:id',function(req,res,next){
  console.log(req.params.id);
  Database.query('DELETE from users where employeeNumber = ' + parseInt(req.params.id))
    res.end()
})

module.exports = router;