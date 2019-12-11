const router = require('express').Router()
const Database = require('../../config/database')

router.get("/changepage/:init", function(req, res, next) {
    Database.query(
        `select * from products as p , productlines as pl where p.productLine = pl.productLine and quantityInStock = 0 limit ${req.params.init},15`,
        function(err, data) {
            res.json(data);
        }
    );
});

router.get("/instockItem", function(req, res, next) {
    Database.query(
        "SELECT * FROM products join productlines using (productLine) where quantityInStock = 0",
        function(err, productData, fields) {
            res.json(productData);
        }
    );
});

router.get("/count", function(req, res, next) {
    Database.query(
        "SELECT count(*) as count  FROM products join productlines using (productLine) where quantityInStock = 0",
        function(err, productData, fields) {
            res.json(productData);
        }
    );
});


router.post("/addCart", function(req, res, next) {
    var quantity = parseInt(req.body.quantity);
    var code = req.body.code;
    if (req.session.prerorderCart === undefined) req.session.prerorderCart = []
    if (req.session.totalPreorder === undefined) req.session.totalPreorder = 0
    Database.query(`SELECT * FROM products join productlines using (productLine) WHERE productCode = '${code}'`, (err, data) => {
        var check = false
        let i = 0
        let targetIndex;
        req.session.prerorderCart.forEach(each => {
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
            req.session.prerorderCart.push(myJSON)
        } else {
            req.session.prerorderCart[targetIndex].Quantity += quantity;
            req.session.prerorderCart[targetIndex].Total += quantity * req.session.prerorderCart[targetIndex].Price
        }
        req.session.totalPreorder += quantity
        console.log(req.session.prerorderCart);
        res.json(req.session.totalPreorder)
    })
});


router.delete('/removeCartItem/:code', function(req, res, next) {
    var key = req.params.code;
    var len = req.session.prerorderCart.length
    var targetIndex = undefined;
    for (let i = 0; i < len; i++) {
        if (req.session.prerorderCart[i].code == key) targetIndex = i
    }
    var currentAmount = parseInt(req.session.totalPreorder) - parseInt(req.session.prerorderCart[targetIndex].Quantity)
    req.session.totalPreorder = currentAmount
    console.log(req.session.totalPreorder);

    req.session.prerorderCart.splice(targetIndex, 1)
    res.json({ update: currentAmount })

})

router.get('/getCartItem', function(req, res, next) {
    if (req.session.prerorderCart === undefined) req.session.prerorderCart = []
    if (req.session.totalPreorder === undefined) req.session.totalPreorder = 0
    console.log(req.session.prerorderCart);
    res.json({
        cartItem: req.session.prerorderCart,
        total: req.session.totalPreorder
    })
})



module.exports = router;