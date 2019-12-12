const router = require("express").Router();
const Database = require("../../config/database");

router.get("/fetchInstockitem/:id", function(req, res, next) {
    // console.log(req.params.id);
    Database.query(
        `select * from products as p ,productlines as pl where productCode = '${req.params.id}' and p.productLine = pl.productLine`,
        function(err, data) {
            res.json(data);
        }
    );
});

router.get("/changepage/:init", function(req, res, next) {
    Database.query(`select * from employees where employeeNumber = ${req.session.user} and jobTitle like '%Sale%'`,(err,sale)=>{
        if(sale.length <= 0) res.json({permission : false})
        else {
            Database.query(
                `select * from products as p , productlines as pl where p.productLine = pl.productLine and quantityInStock <> 0 limit ${req.params.init},15`,
                function(err, data) {
                    console.log(`select * from products as p , productlines as pl where p.productLine = pl.productLine where quantityInStock <> 0 limit ${req.params.init},15`);
                    res.json(data);
                }
            );
        }
    })
   
});


router.get("/count", function(req, res, next) {
    Database.query(
        "SELECT count(*) as count  FROM products join productlines using (productLine) where quantityInStock <> 0",
        function(err, productData, fields) {
            res.json(productData);
        }
    );
});



router.post("/addCart", function(req, res, next) {
    var quantity = parseInt(req.body.quantity);
    var code = req.body.code;
    if (req.session.cartItem === undefined) req.session.cartItem = []
    if (req.session.totalQuantitiy === undefined) req.session.totalQuantitiy = 0
    Database.query(`SELECT * FROM products join productlines using (productLine) WHERE productCode = '${code}'`, (err, data) => {
        var check = false
        let i = 0
        let targetIndex;
        req.session.cartItem.forEach(each => {
            if (each.code == code) {
                targetIndex = i;
                check = true;
            }
            i++;
        })
        if (!check) {
            var myJSON = {
                code: data[0].productCode,
                image: data[0].imgSrc,
                Name: data[0].productName,
                Quantity: quantity,
                Price: data[0].buyPrice,
                Total: quantity * data[0].buyPrice
            }
            req.session.cartItem.push(myJSON)
        } else {
            req.session.cartItem[targetIndex].Quantity += quantity;
            req.session.cartItem[targetIndex].Total += quantity * req.session.cartItem[targetIndex].Price
        }
        req.session.totalQuantitiy += quantity
        console.log(req.session.cartItem);
        res.json(req.session.totalQuantitiy)
    })
});

router.delete('/removeCartItem/:code', function(req, res, next) {
    var key = req.params.code;
    var len = req.session.cartItem.length
    var targetIndex = undefined;
    for (let i = 0; i < len; i++) {
        if (req.session.cartItem[i].code == key) targetIndex = i
    }
    var currentAmount = parseInt(req.session.totalQuantitiy) - parseInt(req.session.cartItem[targetIndex].Quantity)
    req.session.totalQuantitiy = currentAmount
    console.log(req.session.totalQuantitiy);

    req.session.cartItem.splice(targetIndex, 1)
    res.json({ update: currentAmount })

})

router.get('/getCartItem', function(req, res, next) {
    if (req.session.cartItem === undefined) req.session.cartItem = []
    if (req.session.totalQuantitiy === undefined) req.session.totalQuantitiy = 0
    console.log(req.session.cartItem);
    res.json({
        cartItem: req.session.cartItem,
        total: req.session.totalQuantitiy
    })
})

module.exports = router;


