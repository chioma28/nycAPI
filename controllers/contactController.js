const { response } = require('express');
const sendEmail = require('../middleware/mail');
//const { connect } = require('../models/db.config');
const auth = require('./authController');
const auditManager = require('./trailController');
/* ******************************* Contact controller ********************** */
let contactController = (app)=>{
    var connection = require('../models/db.config');

/* ******************************* Contact router ********************** */
    app.route('/contact')
/******** GET ROUTE ********/
        .get(auth.authenticate,(req, res)=>{
            if(req.data.data.roleId == 1){
            connection.query(`select * from contact`, (err, response)=>{
                if (err){
                    res.send(err);
                    trail={
                        moduleId: "3",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} unauthorized to view all the info in contacts `,
                        status: "danger"
                    }
                    auditManager.logTrail(trail);
                } else{
                    res.send(response);
                    trail={
                        moduleId: "3",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} viewed all the info in contacts `,
                        status: "success"
                    }
                    auditManager.logTrail(trail);
                }

            })
        }

        })
        /******** POST ROUTE ********/
        .post((req,res)=>{
            const { fullName, email, subject, message } = req.body;
            connection.query(`insert into contact (fullName,email,subject,message) 
            values (
                    '${fullName}',
                     '${email}', 
                    '${subject}', 
                    '${message}')`), sendEmail(fullName,email,subject,message, (err, data)=>{

                        if(err){
                            res.status(500).send(err);
                            trail={
                                moduleId: "3",
                                actor: ` anonymous ${req.body.email}`,
                                action: `${req.body.email} tried to send a message  `,
                                status: "failed"
                            }
                            auditManager.logTrail(trail);
                        } 
                        else{
                            res.status(200).send('Email sent successfully!');
                            trail={
                                moduleId: "3",
                                actor: ` anonymous ${req.body.email}`,
                                action: `${req.body.email} sent a message  `,
                                status: "success"
                            }
                            auditManager.logTrail(trail);
                        }

                    })

        })
        // .post((req, res)=>{
        //     connection.query(`insert into contact (id,fullName,email,title,message) 
        //     values ('${req.body.id}',
        //             '${req.body.fullName}',
        //              '${req.body.email}', 
        //             '${req.body.title}', 
        //             '${req.body.message}')`,
                    
        //             (err, response)=>{
        //                 if(err){
        //                     console.log(err)
        //                 }else{
        //                     res.send("Your Message has been sent succesfully")
        //                 }
               
        //     })



        // })
}
module.exports = contactController