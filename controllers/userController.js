var userController = (app) =>{
    //import all the required dependencies

    var connection = require('../models/db.config');
    const bcrypt = require('bcrypt');
    const formidable = require('formidable');
    const multer  =require('multer');
    const jwt = require('jsonwebtoken');
    const joi = require('joi');
    const path = require('path');
    const auth = require('./authController');
    const randomstring = require('randomstring');
    const sendEmail = require('../middleware/mail');
    const auditManager = require('./trailController');
    const { check, validationResult } = require('express-validator');//validator
    require('dotenv').config();

    //instantiating the .env file
    process.env.ACCESS_TOKEN_SECRET
    process.env.RESET_TOKEN

    /**************************** Get Request *********************************/
    //getting all the records in the table
    app.get('/admin',auth.authenticate,(req,res)=>{
        // checking if you are an admin to get access to view all records
         
        if(req.data.data.roleId == 1){
            connection.query(`select * from users order by id`,(err,resp)=>{
                res.status(200).send(resp);
                trail={
                    moduleId: "11",
                    actor: "anonymous",
                    action: `anonymous user with email ${req.body.email} attempted viewing users but failed`,
                    status: "danger"
                }
                auditManager.logTrail(trail);
            })
        }
        else{
            res.send('You have not been authorized to perform this function').status(403);
            trail={
                moduleId: "11",
                actor: `${req.body.email}`,
                action: ` ${req.body.email} viewed users successfully`,
                status: "success"
            }
            auditManager.logTrail(trail);
        }
        
    })

    //getting the details of any user by id
    app.get('/admin/:id',auth.authenticate,(req,res)=>{
        // checking if you are an admin to get access to view all records
         
        if(req.data.data.roleId == 1){
            connection.query(`select * from users where id = '${req.params.id}'`,(err,resp)=>{
                if (err) throw err
                res.send(resp)
          
            })
        }
        else{
            res.send('You have not been authorized to perform this function').status(403)
        }
        
    })

    //users getting their records from the table by id
    app.get('/users/:id',auth.authenticate,(req,res)=>{
        if(req.params.id == req.data.data.id)
        {
            connection.query(`select * from users where id = '${req.params.id}'`,(err,resp)=>{
                if (err) throw err
                res.send(resp);
                trail={
                    moduleId: "11",
                    actor: `${req.body.email}`,
                    action: `${req.body.email}successfully viewed a user profile `,
                    status: "success"
                }
                auditManager.logTrail(trail);
            })
        }
        else return res.status(403).send('You cannot view this profile');
        trail={
            moduleId: "11",
            actor: "anonymous",
            action: `anonymous user with email ${req.body.email} attempted viewing a user profile but failed`,
            status: "danger"
        }
        auditManager.logTrail(trail);
        
    })
      
    /******************************** Post Request **************************************/
    //adding records into the table
    app.post('/signup',[ 
        ///validation
        check('email')
        .isEmail()
        .withMessage("invalid email address")
        .normalizeEmail(),

        check('businessName') 
                        .isLength({ min: 6})
                        .withMessage('Business name length should not be less than 5 characters'), 
        check('password') 
       .isLength({ min : 8 })
      .withMessage("your password should have minimum of 8 characters")
      .matches(/\d/)
      .withMessage("your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one special character")
      ], (req, res) => { 
      
         // validationResult function checks whether 
        // an error occurs or not and returns an object 
        const errors = validationResult(req); 
      
        // If some error occurs, then this 
        // block of code will run 
        if (!errors.isEmpty()) { 
            res.json(errors) 
        } 
        // If no error occurs, then 
        
        //check if email exists,
      connection.query(`select email from users where email = '${req.body.email}'`,(err,response)=>{
        if(response.length > 0 ){
               res.status(400).send('This email already exists!');
               }
      else{
        
        
            bcrypt.hash(req.body.password,10,(errh,hash)=>{
                if (errh) {
                    res.status(402).send(err);
                }
                //const otpCode = randomstring.generate(); 
                                 
                    connection.query(`insert into users (roleId,businessName,email,password) 
                    values ('2',
                        '${req.body.businessName}',
                        '${req.body.email}',
                        '${hash}'`,(err,resp)=>{
                            if(err)
                            {
                                res.status(400).send(err);
                            } 
                            const encodedOtpCode = encodeURIComponent(
                                Buffer.from(`${otpCode}`, "binary").toString("base64")
                              );

                            res.send(`User ${req.body.businessName} has been successfully registered`);
                            trail={
                                moduleId: "11",
                                actor: `${req.body.email}`,
                                action: `${req.body.email} has been successfully registered `,
                                status: "success"
                            }
                            auditManager.logTrail(trail);
                        })  
                    
    
                
            
    
            }) 
        } 
        
       
    })
        })
    


          /******************************** Put Request **************************************/
          //user updating records after logging in the table
        app.put('/users/profile',auth.authenticate,(req,res)=>{

                connection.query(`update users set phoneNumber = '${req.body.phoneNumber}',
                 website ='${req.body.website}',
                 description ='${req.body.description}',
                 state ='${req.body.state}',
                 city ='${req.body.city}',
                 userCategory ='${req.body.userCategory}' where id = ${req.data.data.id}`,(err,resp)=>{
                    if (err) {
                        res.status(400).send(err);
                    trail={
                        moduleId: "11",
                        actor: `${req.body.email}`,
                        action: `${req.body.email} profile update failed `,
                        status: "failed"
                    }
                    auditManager.logTrail(trail);
                }
                    
                    res.send(`${req.data.data.businessName}`);
                    trail={
                        moduleId: "11",
                        actor: `${req.body.email}`,
                        action: `${req.body.email} profile update successful `,
                        status: "success"
                    }
                    auditManager.logTrail(trail);
                })
           
        })
        

         /******************************** Delete Request **************************************/
        //Deleting records in the table
        app.delete('/admin/:id',auth.authenticate,(req,res)=>{
            if(req.data.data.roleId == 1){
            connection.query(`delete from users where id = ${req.params.id}`,(err,resp)=>{
                
                res.status(200).send(`User with the ID ${req.params.id} has been deleted `);
                trail={
                    moduleId: "11",
                    actor: `${req.body.email}`,
                    action: `${req.body.email}successfully deleted a user profile `,
                    status: "success"
                }
                auditManager.logTrail(trail);
            })
            }
            else{
                    res.sendStatus(404).send('Access denied!');
                    trail={
                        moduleId: "11",
                        actor: 'anonymous',
                        action: `anonymous with email ${req.body.email} failed to deleted a user profile `,
                        status: "danger"
                    }
                    auditManager.logTrail(trail);
            }
            
        })

/****************************************** User Login *************************************************/
app.post('/login',(req,res)=>{
    connection.query(`select * from users where email = '${req.body.email}'`,(err,resp)=>{
        if (err || resp.length < 1) {
            let responseObject = {
                message : "Invalid email or password",
                status : 400 
            }
           // res.statusCode=400;
            res.send(responseObject).status(400);
            trail={
                moduleId: "11",
                actor: "anonymous",
                action: `anonymous user with email '${req.body.email} attempted logging in but failed`,
                status: "danger"
            }
            auditManager.logTrail(trail);
        }
        else{
            
             bcrypt.compare(req.body.password,resp[0].password,function(errh,result){
                 
                     
                 
                 if (result === false) {
                    // res.statusCode = 400;
                     let responseObject = {
                         message : "Invalid email or password",
                         status : 400 
                     }
                     res.send(responseObject).status(400);
                     trail={
                        moduleId: "11",
                        actor: "anonymous",
                        action: `anonymous user with email ${req.body.email} attempted logging in but failed`,
                        status: "danger"
                    }
                    auditManager.logTrail(trail);
                 }
                 if(result === true){

                    //check permissions
                    connection.query(`select permissionName from permission inner join permission_roles on permission.id=permission_roles.permissionId where permission_roles.roleId = ${resp[0].roleId}`,
                    (err,response)=>{
                        if (err) return res.status(401).send(err);
                        resp[0].permissions = response

                        delete resp[0].password//deleting password from result
                        //token logic
                        let data = { "data":resp[0]}
    
                        let accessToken =  jwt.sign(data,process.env.ACCESS_TOKEN_SECRET)
                         //res.send(accessToken)
                       let tokenData ={
                           "data": resp[0],
                           "Token":accessToken
                       }
                       res.send(tokenData)
                       trail={
                        moduleId: "11",
                        actor: `${req.body.email}`,
                        action: `${req.body.email} successfully logged in`,
                        status: "success"
                    }
                    auditManager.logTrail(trail);
                    })
                   

                 }
               
                    
               
             })
        }  
        
       
    })
})

/******************************************* Upload Profile Picture ******************************************/
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req,file,cb) =>{
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
const upload = multer({storage: storage, fileFilter: fileFilter});
   

//Route for uploading

app.put('/users/profile/picture/:id',auth.authenticate,upload.single("image"),(req, res,next)=>{
    if(!req.file) { 
        res.status(406).send("Please upload an image ");
        trail={
            moduleId: "11",
            actor: `${req.body.email}`,
            action: `${req.body.email} profile picture upload failed `,
            status: "failed"
        }
        auditManager.logTrail(trail);
    }
    else{
      var imgSrc = 'http://localhost:8600/uploads/' + req.file.filename
      var insertImg = `update users set displayPicture = ?  where id = '${req.params.id}'`
      connection.query(insertImg,[imgSrc],(err,result)=>{
          if (err) throw err
          res.send('Image successfully uploaded');
          trail={
            moduleId: "11",
            actor: `${req.body.email}`,
            action: `${req.body.email}successfully uploaded profile picture `,
            status: "success"
        }
        auditManager.logTrail(trail);
      })
    }
   
})

/******************************************* View Profile Picture *****************************************/
app.get('/users/profile/picture/:id',auth.authenticate,(req,res)=>{
    connection.query(`select displayPicture from users where id = '${req.params.id}'`,(err,resp)=>{
        if (err) return err

        res.send(resp);
    })
})
   /******************************************* Delete Profile Picture *****************************************/
   app.delete('/users/profile/picture/:id',auth.authenticate,(req,res)=>{
    connection.query(`update users set displayPicture = '' where id = '${req.params.id}'`,(err,resp)=>{
        if (err) {
            res.status(400).send(err);
            trail={
                moduleId: "11",
                actor: `${req.body.email}`,
                action: `${req.body.email} failed to delete profile picture`,
                status: "failed"
            }
            auditManager.logTrail(trail);
        }
        res.send('Image successfully deleted');
        trail={
            moduleId: "11",
            actor: `${req.body.email}`,
            action: `${req.body.email}successfully deleted profile picture `,
            status: "success"
        }
        auditManager.logTrail(trail);
    })
})



/****************************************** Forgot password *************************************************/
   app.post('/forgotPassword',(req,res)=>{
    connection.query(`select * from users where email = '${req.body.email}'`,(err,resp)=>{
       
        if (err || resp.length < 1) {
           
            res.status(401).send('Email does not exist');
        }
        
        else{
                delete resp[0].password
                if(req.body.email == resp[0].email){
                    let data = {"data" : resp[0]}
                    let forgotToken = jwt.sign(data,process.env.RESET_TOKEN)
                    res.send(forgotToken)
                }

           
        }
            
        
        

    })


   })    
   

/******************************************************************** Reset Password******************************************************/

    app.put('/reset',auth.forgotPassword,(req,res)=>{
        // console.log(req.data.data.email)
        bcrypt.hash(req.body.password,10,(errh,hash)=>{
            if (errh) throw err
        connection.query(`update users set password = '${hash}' where email = '${req.data.data.email}' `,(err,resp)=>{
            if(err) return res.send(err)
            res.status(200).send('Password successfully updated');
        })
    })
})





}
module.exports = userController
