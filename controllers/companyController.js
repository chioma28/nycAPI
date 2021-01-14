
    var connection = require('../models/db.config');
    const bodyParser = require('body-parser');
    
    /**************************** post Request *********************************/
    
        const searchBusiness = (req,res, next)=>{
             const {businessName, state, userCategory, keyword} = req.body;
    
            //  const sql = `SELECT businessName, city, userCategory, (((acos(sin(('${latitude}'*pi()/180)) * sin((latitude*pi()/180)) +
            //  cos(('${latitude}'*pi()/180)) * cos((latitude*pi()/180)) * cos((('${longitude}' - longitude)
            //  * pi()/180)))) * 180/pi()) * 60 * 1.1515 * 1.609344) 
            //  as distance FROM users WHERE businessName like '%${keyword}%' HAVING distance <= 100 ORDER BY distance ASC`

             
             const sql = `SELECT businessName, state, userCategory
             FROM users WHERE businessName like '%${keyword}%'`
            // const sql = `SELECT businessName, city, userCategory`

            connection.query(sql, (err, response)=>{
                if(err){
                    console.log(err)
                } else{
                    res.send(response)
                }
    
            })
    
    
    
         }
            const searchState = (req,res, next)=>{
            const {businessName, state, userCategory, keyword} = req.body;
   
           //  const sql = `SELECT businessName, city, userCategory, (((acos(sin(('${latitude}'*pi()/180)) * sin((latitude*pi()/180)) +
           //  cos(('${latitude}'*pi()/180)) * cos((latitude*pi()/180)) * cos((('${longitude}' - longitude)
           //  * pi()/180)))) * 180/pi()) * 60 * 1.1515 * 1.609344) 
           //  as distance FROM users WHERE businessName like '%${keyword}%' HAVING distance <= 100 ORDER BY distance ASC`

            
            const sql = `SELECT businessName, state, userCategory
            FROM users WHERE state like '%${keyword}%'`
           // const sql = `SELECT businessName, city, userCategory`

           connection.query(sql, (err, response)=>{
               if(err){
                   console.log(err)
               } else{
                   res.send(response)
               }
   
           })
   
   
   
        }



      const searchCategory = (req,res, next)=>{
            const {businessName, state, userCategory, keyword} = req.body;
   
           //  const sql = `SELECT businessName, city, userCategory, (((acos(sin(('${latitude}'*pi()/180)) * sin((latitude*pi()/180)) +
           //  cos(('${latitude}'*pi()/180)) * cos((latitude*pi()/180)) * cos((('${longitude}' - longitude)
           //  * pi()/180)))) * 180/pi()) * 60 * 1.1515 * 1.609344) 
           //  as distance FROM users WHERE businessName like '%${keyword}%' HAVING distance <= 100 ORDER BY distance ASC`

            
            const sql = `SELECT businessName, state, userCategory
            FROM users WHERE userCategory like '%${keyword}%'`
           // const sql = `SELECT businessName, city, userCategory`

           connection.query(sql, (err, response)=>{
               if(err){
                   console.log(err)
               } else{
                   res.send(response)
               }
   
           })
   
   
   
        }
    
        
    
    
    
    
    module.exports = {searchCategory, searchState, searchBusiness}