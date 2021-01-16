let advertController = (app)=>{
    var connection = require('../models/db.config');
    const jwt = require('jsonwebtoken');
    const auth = require('../controllers/authController');
    const path = require('path');
    const multer  =require('multer');
    const auditManager = require('./trailController');
    require('dotenv').config();

    //instantiating the .env file
    process.env.ACCESS_TOKEN_SECRET
    process.env.FORGOT_TOKEN_SECRET
    
    /******************************************* POSTING THE ADVERT *****************************************/
    ///Uploading the flyer to a root folder
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

    //posting the advert into the database

    app.post('/adverts',auth.authenticate,upload.single("image"),(req, res,next)=>{
        if(req.data.data.roleId == 1 || req.data.data.roleId == 2 ){
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
          var insertAdvert = `insert into adverts (userId,title,description,isEnabled,flyer) values ('${req.data.data.id}',
          '${req.body.title}',
          '${req.body.description}',
          'disabled',
          ?)`
          connection.query(insertAdvert,[imgSrc],(err,result)=>{
              if (err) { 
                  res.status(402).send(err);
                  trail={
                    moduleId: "1",
                    actor: `${req.data.data.email}`,
                    action: `${req.data.data.email} advert upload unsuccessful `,
                    status: "failed"
                }
                auditManager.logTrail(trail);
              }
              res.send('Advert successfully posted. Please wait for admin to approve your post before you will be able to view it.');
              trail={
                moduleId: "1",
                actor: `${req.data.data.email}`,
                action: `${req.data.data.email} advert upload successful `,
                status: "success"
            }
            auditManager.logTrail(trail);
          })
        }
    }
   
    else{
        res.status(401).send('Access Denied!');
        trail={
            moduleId: "1",
            actor: `${req.data.data.email}`,
            action: `${req.data.data.email} is unauthorized to upload adverts`,
            status: "danger"
        }
        auditManager.logTrail(trail);
    }
       
    })
    
         

   
 /******************************************* GETTING THE ADVERT *****************************************/
 //users checking the adverts posted
    app.get('/adverts',auth.authenticate,(req,res)=>{
        if(req.data.data.roleId == 2 ){
            connection.query(`select isEnabled from adverts where userId = '${req.data.data.id}'`,(err,result)=>{
                 
               var resultString = JSON.stringify(result)
               const resp = '[{"isEnabled":"enabled"}]';
                if(resultString == resp){
                       

        connection.query(`select title,description,flyer from adverts where userId = '${req.data.data.id}'`, (err, response)=>{
            if(err){
                res.status(401).send(err);
                trail={
                    moduleId: "1",
                    actor: `${req.data.data.email}`,
                    action: `${req.data.data.email} was unable to view adverts `,
                    status: "failed"
                }
                auditManager.logTrail(trail);

            }
            else{
                res.send(response);
                trail={
                    moduleId: "1",
                    actor: `${req.data.data.email}`,
                    action: `${req.data.data.email} was able to view adverts `,
                    status: "success"
                }
                auditManager.logTrail(trail);

            }
        })
          
        //admin checking the advert posted
        // else if(req.data.data.roleId == 1){
        //     connection.query(`select title,description,flyer from adverts `, (err, response)=>{
        //         if(err){
        //             res.status(401).send(err);
        //             trail={
        //                 moduleId: "1",
        //                 actor: `${req.data.data.email}`,
        //                 action: `${req.data.data.email} was unable to view adverts `,
        //                 status: "failed"
        //             }
        //             auditManager.logTrail(trail);
    
    
        //         }else{
        //             res.send(response);
        //             trail={
        //                 moduleId: "1",
        //                 actor: `${req.data.data.email}`,
        //                 action: `${req.data.data.email} is able to view adverts `,
        //                 status: "success"
        //             }
        //             auditManager.logTrail(trail);
    
        //         }
        //     })
           // } 
            // 
        
        }
        else{
            let responseObject = {
                message : "You are not authorized to view your adverts yet. Please wait for the admin to verify for your post.",
                status : 200
            }
            res.status(200).send(responseObject);

        }
    
    })
    }


else{
        res.status(403).send('Access Denied!');
        trail={
            moduleId: "1",
            actor: `${req.data.data.email}`,
            action: `${req.data.data.email} is unauthorized to view adverts `,
            status: "danger"
        }
        auditManager.logTrail(trail);
    }
}) 

    
        /******************************************* ADMIN ADVERT VERIFICATION*****************************************/
        //getting all the adverts posted by all users
        app.get('/admin/adverts',auth.authenticate,(req,res)=>{
            if(req.data.data.roleId == 1 ){
    
            connection.query(`select id,userId,title,description,flyer,isEnabled from adverts `, (err, response)=>{
                if(err){
                    res.status(401).send(err);
                    trail={
                        moduleId: "1",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} was unable to view adverts `,
                        status: "failed"
                    }
                    auditManager.logTrail(trail);
    
                }
                else{
                    res.send(response);
                    trail={
                        moduleId: "1",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} was able to view adverts `,
                        status: "success"
                    }
                    auditManager.logTrail(trail);
    
                }
            })
              
        
        }
    
    
    else{
            res.status(403).send('Access Denied!');
            trail={
                moduleId: "1",
                actor: `${req.data.data.email}`,
                action: `${req.data.data.email} is unauthorized to view adverts `,
                status: "danger"
            }
            auditManager.logTrail(trail);
        }
    }) 
    
        
    //Enabling the adverts posted by the user
        app.put('/admin/adverts/:id',auth.authenticate, (req,res)=>{
          
        if(req.data.data.roleId == 1 ){
        connection.query(`update adverts set isEnabled = 'enabled' where userId = '${req.params.id}' AND id = '${req.body.id}' `,(err,resp)=>{
            if(err){
                res.send(err).status(400);
                
                    trail={
                        moduleId: "1",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} was unable to enable an advert `,
                        status: "failed"
                    }
                    auditManager.logTrail(trail);
            }
            else{
                let responseObject = {
                    message : 'Advert Successfully Enabled',
                    status : 200
                }
                res.send(responseObject).status(200);
                    trail={
                        moduleId: "1",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} enabled an advert `,
                        status: "success"
                    }
                    auditManager.logTrail(trail);

            }
        })
    }
    else{
        let responseObject = {
            message : 'You are not authorized to enable an advert',
            status : 401
        }
        res.send(responseObject).status(401);
    }
    })
  
      /******************************************* DELETING THE ADVERT *****************************************/

     app.delete('/adverts/:id', auth.authenticate, (req, res)=>{
            connection.query(`delete from adverts where id = ${req.params.id} && userId = ${req.data.data.id}`, (err, response)=>{
                if(err){
                    res.send(err);
                    trail={
                        moduleId: "1",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} was unable to delete an advert `,
                        status: "failed"
                    }
                    auditManager.logTrail(trail);
                }
                else{
                    res.send('Advert Successfully Deleted');
                    trail={
                        moduleId: "1",
                        actor: `${req.data.data.email}`,
                        action: `${req.data.data.email} deleted an advert `,
                        status: "success"
                    }
                    auditManager.logTrail(trail);

                }

            })


        })
    }


module.exports = advertController


