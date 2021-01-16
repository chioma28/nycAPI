const { response } = require('express');
const sendMail = require('../middleware/mail');
//const { connect } = require('../models/db.config');
const auth = require('./authController');
const auditManager = require('./trailController');
/* ******************************* Contact controller ********************** */

    var connection = require('../models/db.config');

/* ******************************* Contact router ********************** */

/******** GET ROUTE ********/
        const getContact =  (req, res, next)=>{
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

        }
        /******** POST ROUTE ********/
       const postContact = (req,res, next)=>{
            const { fullName, email, title, message } = req.body;
            connection.query(`insert into contact (fullName,email,title,message) 
            values (
                    '${fullName}',
                     '${email}', 
                    '${title}', 
                    '${message}')`), sendMail(fullName,email,title,message, (err, data)=>{

                        if(err){
                            res.status(500).json({ message: 'Internal Error' });
                            res.status({ message: 'Email sent!!!' });
                            trail={
                                moduleId: "3",
                                actor: ` anonymous ${req.body.email}`,
                                action: `${req.body.email} tried to send a message  `,
                                status: "failed"
                            }
                            auditManager.logTrail(trail);
                        } else{
                            res.status({ message: 'Email sent!!!' });
                            trail={
                                moduleId: "3",
                                actor: ` anonymous ${req.body.email}`,
                                action: `${req.body.email} sent a message  `,
                                status: "success"
                            }
                            auditManager.logTrail(trail);
                        }

                    })

        }
        

module.exports = {getContact, postContact}