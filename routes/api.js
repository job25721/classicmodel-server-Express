var express = require("express");
var router = express.Router();
var Database = require("../config/database");
var bcrypt = require("bcryptjs");



router.use('/admin', require('./admin/admin'))

router.get("/user", function(req, res, next) {
    if (req.session.user != undefined) {
        Database.query(`SELECT firstName,lastName,jobTitle FROM employees WHERE employeeNumber = ${parseInt(req.session.user)}`, (err, data) => {
            res.json(data);
        });
    } else res.end()
});
router.get("/authenCheck", function(req, res, next) {
    if (req.session.loggedin) res.json({ "login": true })
    else res.json({ "login": false })
})

router.post("/auth", function(req, res, next) {
    var { username, password } = req.body.user;

    Database.query(
        "SELECT pswd FROM users WHERE employeeNumber = " + parseInt(username),
        (err, data) => {
            if (data.length > 0) {
                bcrypt.compare(password.toString(), data[0].pswd, function(
                    err,
                    compared
                ) {
                    if (compared) {
                        req.session.loggedin = true;
                        req.session.user = username;
                        console.log(req.session);

                        res.json({ falied: false, worked: true });
                    } else {
                        req.session.loggedin = false;
                        req.session.user = null;
                        res.json({ failed: true, worked: true });
                    }
                });
            } else {
                req.session.loggedin = false;
                req.session.user = null;
                res.json({ failed: true, worked: false });
            }
        }
    );
});



router.get('/logout',function(req,res,next){
  req.session.loggedin = false
  req.session.user = undefined
  res.end()
})

router.get('/destroySession', function(req, res, next) {
    req.session.cartItem = undefined;
    req.session.totalQuantitiy = undefined;
})

module.exports = router;