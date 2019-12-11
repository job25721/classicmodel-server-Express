const router = require('express').Router();
const Database = require("../../config/database");

function map(Role){
    if(Role == 1) return "Sales Rep"
    else if(Role == 2) return "Sale Manager"
    else if(Role == 3) return "VP Sales"
}

router.get('/employeeData',function(req,res,next){    
    var employeeNumber 
    if (req.session.user !== undefined) {
        employeeNumber = parseInt(req.session.user)
        Database.query(`select * from employees where reportsTo = ${employeeNumber}`, (err, data) => {
            res.json(data)
        })
    } else {
        res.end()
    }
})

router.get('/edit/:id',function (req,res,next) {
    req.session.editSESSION = req.params.id
        Database.query(`select * from employees where employeeNumber = ${req.session.editSESSION}` , (err, data) => {
            if (data.length > 0)
                res.json(data)
    })
})

router.post('/promote/:id',function(req,res,next){
    const employeeNumber = req.params.id;
    Database.query(`select distinct Role,reportsTo from employees where employeeNumber = ${employeeNumber}`,(err,employee)=>{
        if(employee.length > 0 ) {
            let promotedRole = parseInt(employee[0].Role) + 1  
            let SupervisorID = parseInt(employee[0].reportsTo)
            var updatedJob = ''
            if(promotedRole == 4) res.send("you can't become to president");
            else{
                 //if promote represent to supervisee
                 //select supervisor to compare
                Database.query(`select distinct jobTitle,Role from employees where employeeNumber = ${SupervisorID}`,(err,supervise)=>{
                    if(supervise.length > 0){
                        if(promotedRole < supervise[0].Role){
                            if(promotedRole == 3){
                                Database.query(`select * from employees where reportsTo = ${employeeNumber}`,(err,data)=>{
                                    if(data.length <= 0 ) updatedJob = "VP Marketing"
                                    else updatedJob = "VP Sales"
                                    Database.query(`update employees set jobTitle = '${updatedJob}',Role = ${promotedRole} where employeeNumber =  ${employeeNumber}`)
                                    res.send(`Updated empoyee jobTitle to ${updatedJob}`)
                                })
                            }else{
                                updatedJob = map(promotedRole);   
                                Database.query(`update employees set jobTitle = '${updatedJob}',Role = ${promotedRole} where employeeNumber =  ${employeeNumber}`)
                                res.send(`Updated empoyee jobTitle to ${updatedJob}`)
                            }
                            
                            
                        }else if(promotedRole >= supervise[0].Role) res.send("you can't go higer anymore")
                    }
                })
            }
        }
    })


    
})

router.post('/demote/:id',function(req,res,next){
    const employeeNumber = req.params.id;
    Database.query(`select distinct Role,reportsTo from employees where employeeNumber = ${employeeNumber}`,(err,employee)=>{
        if(employee.length > 0 ) {
            let demotedRole = parseInt(employee[0].Role) - 1  
            var updatedJob = ''
            if(demotedRole < 1) res.send("you can't demote anymore")
            else{
                updatedJob = map(demotedRole);
                Database.query(`update employees set jobTitle = '${updatedJob}',Role = ${demotedRole} where employeeNumber = ${employeeNumber}`)
                res.send(`updated employee jobTitle to ${updatedJob}`)
            }
        }
    })

})



module.exports = router;