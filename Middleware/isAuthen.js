module.exports = {
    function (req,res,next) {
        if(req.session.loggedin) next()
        else res.json({"status":false})
    }
}