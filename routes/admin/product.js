const router = require('express').Router();
const Database = require("../../config/database");

router.get('/instockItem',function(req,res,next){
    Database.query('SELECT * FROM products join productlines using (productLine)', function (err, productData, fields) {
        res.json(productData);
    })
})

router.get('/fetchInstockitem/:id',function(req,res,next){
    Database.query(`select * from products as p , productlines as pl where productCode = '${req.params.id}' and p.productLine = pl.productLine`,function(err,data){
        res.json(data)
    })
})

router.post('/addCart',function(req,res,next){
    if (req.body.quantity != undefined && req.body.quantity != undefined) {
        var quantity_params = parseInt(req.body.quantity)
        var code = req.body.code

        function ProductCode(pcode) {
            return pcode.code === code;
        }
        if (req.session.cart_item == undefined && req.session.total_piece == undefined) {
            req.session.cart_item = []
            req.session.total_piece = 0;
            req.session.totalPrice = 0;

        }
        req.session.total_piece += quantity_params
        Database.query('SELECT * FROM products join productlines using (productLine) WHERE productCode = ? ', code, (err, data) => {
            req.session.totalPrice += (quantity_params * data[0].buyPrice);
            var myJSON = {
                name: data[0].productName,
                code: data[0].productCode,
                quntity: quantity_params,
                price: data[0].buyPrice,
                total: data[0].buyPrice * quantity_params,
                image: data[0].imgSrc
            }

            if (req.session.cart_item.find(ProductCode) != undefined) {

                req.session.cart_item.find(ProductCode).quntity += quantity_params
                req.session.cart_item.find(ProductCode).total = (req.session.cart_item.find(ProductCode).quntity) * req.session.cart_item.find(ProductCode).price
            } else {
                req.session.cart_item.push(myJSON)


            }
            res.json([{
                row: req.session.cart_item.length
            }, {
                piece: req.session.total_piece
            }])
        });

    } else {
        if (req.session.cart_item != undefined) res.json([{
            row: req.session.cart_item.length
        }, {
            piece: req.session.total_piece
        }]);
        else res.json([{
            row: 0
        }, {
            piece: 0
        }]);
    }
})

module.exports = router;