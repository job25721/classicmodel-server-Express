const router = require('express').Router();
const Database = require("../../config/database");

router.get('/instockItem',function(req,res,next){
    Database.query('SELECT * FROM products join productlines using (productLine)', function (err, productData, fields) {
        res.json(productData);
    })
})

module.exports = router;