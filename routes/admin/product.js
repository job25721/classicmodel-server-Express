const router = require('express').Router();
const Database = require("../../config/database");

router.get('/instockItem', function(req, res, next) {
    Database.query('SELECT * FROM products join productlines using (productLine)', function(err, productData, fields) {
        res.json(productData);
    })
})

router.get('/fetchInstockitem/:id', function(req, res, next) {
    // console.log(req.params.id);

    Database.query(`select * from products as p ,productlines as pl where productCode = '${req.params.id}' and p.productLine = pl.productLine`, function(err, data) {
        // console.log(data);
        res.json(data)
    })
})

router.get('/changepage/:init', function(req, res, next) {
    console.log(req.params.init)
    Database.query(`select * from products as p , productlines as pl where p.productLine = pl.productLine limit ${req.params.init},15`, function(err, data) {
        res.json(data)
    })
})

router.get('/instockItem', function(req, res, next) {
    Database.query('SELECT * FROM products join productlines using (productLine)', function(err, productData, fields) {
        res.json(productData);
    })
})

router.get('/count', function(req, res, next) {
    Database.query('SELECT count(*) as count  FROM products join productlines using (productLine)', function(err, productData, fields) {
        res.json(productData);
    })
})

module.exports = router;

router.get("/orderStatus", function(req, res, next) {
    Database.query(
        "select DATE_FORMAT(orderDate,'%m-%d-%Y') as orderDate,DATE_FORMAT(requiredDate,'%m-%d-%Y') as requiredDate , DATE_FORMAT(shippedDate,'%m-%d-%Y') as shippedDate,orderNumber,status,customerNumber  from orders",
        function(err, data) {
            res.json(data);
        }
    );
});

module.exports = router;