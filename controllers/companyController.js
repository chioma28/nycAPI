
    var connection = require('../models/db.config');
    const bodyParser = require('body-parser');
    
    /**************************** get Request *********************************/
    // const searchBusiness = (req,res,next)=>{
    //     // const {businessName, email, phoneNumber, website, state, description, userCategory, keyword} = req.body;
    //    // const sql = `SELECT businessName, email, phoneNumber,website,state,description,userCategory from users WHERE businessName LIKE '%${keyword}%' OR state LIKE '%${keyword}%' OR userCategory LIKE '%${keyword}%'`
    //     connection.query(`SELECT businessName, email, phoneNumber,website,state,description,userCategory from users`, (err, response)=>{
    //         if(err){
    //             // let responseObject ={
    //             //     message: err,
    //             //     status : 400
    //             // }
    //             res.status(400).send(err);
               
    //         }
    //         else{
                
    //             res.send(response).status(200);
    //         }
    //     })
    
    // }
    
    //     const searchBusiness = (req,res, next)=>{
    //          const {businessName, state, userCategory, keyword} = req.body;
    
    //         //  const sql = `SELECT businessName, city, userCategory, (((acos(sin(('${latitude}'*pi()/180)) * sin((latitude*pi()/180)) +
    //         //  cos(('${latitude}'*pi()/180)) * cos((latitude*pi()/180)) * cos((('${longitude}' - longitude)
    //         //  * pi()/180)))) * 180/pi()) * 60 * 1.1515 * 1.609344) 
    //         //  as distance FROM users WHERE businessName like '%${keyword}%' HAVING distance <= 100 ORDER BY distance ASC`

             
    //          const sql = `SELECT businessName, state, userCategory
    //          FROM users WHERE businessName like '%${keyword}%'`
    //         // const sql = `SELECT businessName, city, userCategory`

    //         connection.query(sql, (err, response)=>{
    //             if(err){
    //                 console.log(err)
    //             } else{
    //                 res.send(response)
    //             }
    
    //         })
    
    
    
    //      }
            const findBusiness = (req,res,next) =>{
            
           connection.query(`SELECT businessName, email, phoneNumber, description, website , state, userCategory FROM users`, (err, response)=>{
               if(err){
                   console.log(err)
               } else{

                   res.send(response);
               }
   
           })
   
   
   
        }




    //   const searchCategory = (req,res, next)=>{
    //         const {businessName, state, userCategory, keyword} = req.body;
   
    //        //  const sql = `SELECT businessName, city, userCategory, (((acos(sin(('${latitude}'*pi()/180)) * sin((latitude*pi()/180)) +
    //        //  cos(('${latitude}'*pi()/180)) * cos((latitude*pi()/180)) * cos((('${longitude}' - longitude)
    //        //  * pi()/180)))) * 180/pi()) * 60 * 1.1515 * 1.609344) 
    //        //  as distance FROM users WHERE businessName like '%${keyword}%' HAVING distance <= 100 ORDER BY distance ASC`

            
    //         const sql = `SELECT businessName, state, userCategory
    //         FROM users WHERE userCategory like '%${keyword}%'`
    //        // const sql = `SELECT businessName, city, userCategory`

    //        connection.query(sql, (err, response)=>{
    //            if(err){
    //                console.log(err)
    //            } else{
    //                res.send(response)
    //            }
   
    //        })
   
   
   
    //     }
    
        
    
    
    
    
    module.exports =  {findBusiness}