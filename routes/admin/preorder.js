const router = require('express').Router()
const Database = require('../../config/database')


router.get('/fetch', function(req, res, next) {
    Database.query(`select * from preorders`, function(err, data) {
        console.log(data.length);
        res.json(data)
    })
})

router.get("/changepage/:init", function(req, res, next) {
    Database.query(
        `select * from products as p , productlines as pl where p.productLine = pl.productLine and quantityInStock = 0 limit ${req.params.init},15`,
        function(err, data) {
            res.json(data);
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
    if (req.session.preorderCart === undefined) req.session.preorderCart = []
    if (req.session.totalPreorder === undefined) req.session.totalPreorder = 0
    Database.query(`SELECT * FROM products join productlines using (productLine) WHERE productCode = '${code}'`, (err, data) => {
        var check = false
        let i = 0
        let targetIndex;
        req.session.preorderCart.forEach(each => {
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
            req.session.preorderCart.push(myJSON)
        } else {
            req.session.preorderCart[targetIndex].Quantity += quantity;
            req.session.preorderCart[targetIndex].Total += quantity * req.session.preorderCart[targetIndex].Price
        }
        req.session.totalPreorder += quantity
        console.log(req.session.preorderCart);
        res.json(req.session.totalPreorder)
    })
});


router.delete('/removeCartItem/:code', function(req, res, next) {
    var key = req.params.code;
    var len = req.session.preorderCart.length
    var targetIndex = undefined;
    for (let i = 0; i < len; i++) {
        if (req.session.preorderCart[i].code == key) targetIndex = i
    }
    var currentAmount = parseInt(req.session.totalPreorder) - parseInt(req.session.preorderCart[targetIndex].Quantity)
    req.session.totalPreorder = currentAmount
    console.log(req.session.totalPreorder);

    req.session.preorderCart.splice(targetIndex, 1)
    res.json({ update: currentAmount })

})

router.get('/getCartItem', function(req, res, next) {
    if (req.session.preorderCart === undefined) req.session.preorderCart = []
    if (req.session.totalPreorder === undefined) req.session.totalPreorder = 0
    console.log(req.session.preorderCart);
    res.json({
        cartItem: req.session.preorderCart,
        total: req.session.totalPreorder
    })
})

router.get('/update/:value/:orderNumber', function(req, res, next) {
    var value = req.params.value
    var orderNumber = req.params.orderNumber
    Database.query(`update preorders set status="${value}" where orderNumber=${orderNumber}`)
})

router.get('/setShippedDate/:orderno', function(req, res, next) {
    var orderno = req.params.orderno
    Database.query(`update preorders set shippedDate = current_timestamp where orderNumber = ${orderno}`)
})

router.get('/detail/:orderNumber', function(req, res, next) {
    var orderNumber = req.params.orderNumber
    Database.query(`select * from preorders join preorderdetails using (orderNumber) where orderNumber = ${orderNumber}`, function(err, data) {
        res.json(data)
    })
})

router.get('/editdetail/:comment/:orderno', function(req, res, next) {
    var comment = req.params.comment
    var orderno = req.params.orderno
    console.log(comment);
    Database.query(`update preorders set comments = "${comment}" where orderNumber = ${orderno}`)
})


module.exports = router;