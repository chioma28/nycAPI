const text = require('body-parser/lib/types/text');


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
    const sendMail = require('../middleware/mail');
    require('dotenv').config();

    //instantiating the .env file
    process.env.ACCESS_TOKEN_SECRET
    process.env.FORGOT_TOKEN_SECRET

    /**************************** Get Request *********************************/
    //getting all the records in the table
    const getAllUser = (req,res, next)=>{
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
        
    }

    //getting the details of any user by id
    const getUserId = (req,res, next)=>{
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
        
    }

    //users getting their records from the table by id
   const getUserByUser = (req,res)=>{
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
        
    }
      
    /******************************** Post Request **************************************/
    //adding records into the table
   const userSignup =  (req, res) => { 
      
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
//       connection.query(`select email from users where email = '${req.body.email}'`,(err,response)=>{
//         if(response.length > 0 ){
//                res.send('This email already exists!');
//                }
//       else{
        
        
//             bcrypt.hash(req.body.password,10,(errh,hash)=>{
//                 if (errh) {
//                     res.status(402).send(err);
//                 }



//                 // Sending verification link to user

//                var otpToken = require('crypto').randomBytes(64).toString('hex');
//                const secretCode = encodeURIComponent(otpToken);

//                     connection.query(`insert into users (roleId,businessName,email,password, otp) 
//                     values ('2',
//                         '${req.body.businessName}',
//                         '${req.body.email}',
//                         '${hash}', '${otpToken}')`,(err,resp)=>{
//                             if(err)
//                             {
//                                 res.status(400).send(err);
//                             }
//     const newUserId = resp.insertId      
//     var accessToken = jwt.sign({uid : newUserId, token: secretCode}, process.env.SIGNUP_TOKEN, {expiresIn: '2h'})

//     var linkCode = encodeURIComponent(Buffer.from(`${accessToken}`, 'binary').toString('base64'));

  
//     var message = `Hi ${req.body.businessName}, <br/>
//   <p>Welcome to <b>naijayellowcatagogue</b>, you are a click away from accessing your account. Click on the button below to activate your account.</p>
//   <center><a href="${process.env.BASE_URL}/auth/activation/${linkCode }"><button style="padding: 12px; color: white; background: #000066; border: none; border-radius: 6px;">Activate My Account</button></a></center> 
//   <p>Or Copy the link below to your browser:<br/>
//   <a href="${process.env.BASE_URL}/auth/activation/${linkCode}">${process.env.BASE_URL}/auth/activation/${linkCode}}</a></p>
//   <br/>Thanks.`


//     const sendEmail = ( req.body.businessName, "naijayellowcatalog@gmail.com", "Registration successful, activate your account", message, req.body.email )
  

//                             res.send(`User ${req.body.businessName} has been successfully registered`);
                            
//                             trail={
//                                 moduleId: "11",
//                                 actor: `${req.body.email}`,
//                                 action: `${req.body.email} has been successfully registered `,
//                                 status: "success"
//                             }
//                             auditManager.logTrail(trail);
//                         })  
                    
    
                
            
    
//             }) 
//         } 
        
       
//     })
connection.query(`select email from users where email = '${req.body.email}'`,(err,response)=>{
    if(response.length > 0 && response){
        let responseObject = {
            message : 'This email already exists!',
            status : 400 
        }
        res.send(responseObject).status(400);
           
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
                    '${hash}')`,(err,resp)=>{
                        if(err)
                        {
                            res.status(400).send(err);
                        }
                        let responseObject = {
                            message :`User ${req.body.businessName} has been successfully registered`,
                            status : 200 
                        }
                        res.send(responseObject).status(200);
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
        }
        
   const authActivate = (req, res)=>{
        var { linkCode } = req.params;
        
        if(!accessToken) return res.status(403).json({ message: 'Error!!! Check Link Again' });
        // DECODE URI COMPONENT
        const decodedToken = decodeURIComponent(linkCode);
        // DECODE BACK TO BINARY
        token = Buffer.from(decodedToken, 'base64').toString();
        
        // VERIFY TOKEN
        jwt.verify(token, process.env.SIGNUP_TOKEN_SECRET, (err, data) => {
            if (err) { 
                return res.status(401).json({ message: 'Error!!! Check Link Again' }); 
            }
            // DECODE BASE64 TO GET THE RAW DATA
            userID = Buffer.from(data.uid, 'base64').toString();
            otpToken = Buffer.from(data.token, 'base64').toString();
            connection.query(`SELECT email, otp, isEnabled FROM users WHERE ID = ${userID}`, (err, resp) => {
                if (err) { return res.status(422).json({message : err.sqlMessage}); }
                if (resp.length > 0) {
                    if (resp[0].isEnabled == 1) {
                        return res.status(200).json({message : 'Account already activated! Proceed to login'})
                    }
                    if (resp[0].token == otpToken) {
                        connection.query(`UPDATE users SET isEnabled = 1 WHERE ID = ${userID}`, (err2, resp2) => {
                            if (err2) { return res.status(422).json({message : err2.sqlMessage}); }
                            return res.status(201).json({message : 'Account activated! You may proceed to login'})
                        });
                    } else {
                        return res.status(401).json({message : 'Error validating account! Check Activation Link Again'})
                    }
                } else {
                    return res.status(404).json({message : 'No account found! Check Activation Link Again'})
                }
            });
        });
      }

          /******************************** Put Request **************************************/
          //user updating records after logging in the table
          //profile picture upload
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


       const userUpdateRecords =  (req,res)=>{
        if(!req.file) { 
            res.status(406).send("Please upload an image ");
            trail={
                moduleId: "1",
                actor: `${req.data.data.email}`,
                action: `$${req.data.data.email} advert upload failed `,
                status: "failed"
            }
            auditManager.logTrail(trail);
        }   
        else{
            var imgSrc = process.env.IMG_URL + req.file.filename
            var updateUserDetails = `update users set displayPicture = ?,
            phoneNumber = '${req.body.phoneNumber}',
            website ='${req.body.website}',
            description ='${req.body.description}',
            state ='${req.body.state}',
            city ='${req.body.city}',
            userCategory ='${req.body.userCategory}',
            fax ='${req.body.fax}'
            where id = ${req.data.data.id}`
            
            connection.query(updateUserDetails,[imgSrc],(err,resp)=>{
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
               let responseObject = {
                   message : "Your profile has been successfully updated!",
                   status : 200
               }
               res.send(responseObject).status(200);
               trail={
                   moduleId: "11",
                   actor: `${req.body.email}`,
                   action: `${req.body.email} profile update successful `,
                   status: "success"
               }
               auditManager.logTrail(trail);
           })
        }

        
        }
        

         /******************************** Delete Request **************************************/
        //Deleting records in the table
        const adminDeleteRecord = (req,res)=>{
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
            
        }

/****************************************** User Login *************************************************/
const userLogin = (req,res)=>{
    connection.query(`select * from users where email = '${req.body.email}'`,(err,resp)=>{
        if (err || resp.length < 1) {
            res.statusCode=401;
            res.send("Invalid email or password");
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
                     res.statusCode = 401;
                     res.send('Invalid email or password');
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
}

/******************************************* Upload Profile Picture ******************************************/
// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,"uploads");
//     },
//     filename:(req,file,cb)=>{
//         cb(null,Date.now() + path.extname(file.originalname));
//     },
// });

// const fileFilter = (req,file,cb) =>{
//     if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"){
//         cb(null,true);
//     }
//     else{
//         cb(null,false);
//     }
// }
// const upload = multer({storage: storage, fileFilter: fileFilter});
   

// //Route for uploading

// const updateProfilePic =  (req, res,next)=>{
//     if(!req.file) { 
//         res.status(406).send("Please upload an image ");
//         trail={
//             moduleId: "11",
//             actor: `${req.body.email}`,
//             action: `${req.body.email} profile picture upload failed `,
//             status: "failed"
//         }
//         auditManager.logTrail(trail);
//     }
//     else{
//       var imgSrc = 'http://localhost:8600/uploads/' + req.file.filename
//       var insertImg = `update users set displayPicture = ?  where id = '${req.params.id}'`
//       connection.query(insertImg,[imgSrc],(err,result)=>{
//           if (err) throw err
//           res.send('Image successfully uploaded');
//           trail={
//             moduleId: "11",
//             actor: `${req.body.email}`,
//             action: `${req.body.email}successfully uploaded profile picture `,
//             status: "success"
//         }
//         auditManager.logTrail(trail);
//       })
//     }
   
// }

/******************************************* View Profile Picture *****************************************/
const viewProfilePic = (req,res)=>{
    connection.query(`select displayPicture from users where id = '${req.params.id}'`,(err,resp)=>{
        if (err) return err

        res.send(resp);
    })
}
   /******************************************* Delete Profile Picture *****************************************/
   const deleteProfilePic = (req,res)=>{
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
}



/****************************************** Forgot password *************************************************/
  const forgotPassword =  (req,res)=>{
    connection.query(`select * from users where email = '${req.body.email}'`,(err,resp)=>{
       
        if (err || resp.length < 1) {
           
            res.status(401).send('Email does not exist');
        }
        
        else{
                delete resp[0].password
                if(req.body.email == resp[0].email){
                    let data = {"data" : resp[0]}
                    let forgotToken = jwt.sign(data,process.env.FORGOT_TOKEN_SECRET)
                    res.send(forgotToken)
                }

           
        }
            
        
        

    })


   }  
   

/******************************************************************** Reset Password******************************************************/

    const resetPassword = (req,res)=>{
        // console.log(req.data.data.email)
        bcrypt.hash(req.body.password,10,(errh,hash)=>{
            if (errh) throw err
        connection.query(`update users set password = '${hash}' where email = '${req.data.data.email}' `,(err,resp)=>{
            if(err) return res.send(err)
            res.status(200).send('Password successfully updated');
        })
    })
}






module.exports = {getAllUser,getUserId,
                  getUserByUser, userSignup,
                  authActivate, userUpdateRecords,
                  adminDeleteRecord,userLogin,viewProfilePic,
                  deleteProfilePic,forgotPassword,resetPassword   
    }
