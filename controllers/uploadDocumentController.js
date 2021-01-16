

 global.__basedir = __dirname;



    const { connect } = require('../models/db.config');
    const { response } = require('express');
    const connection = require('../models/db.config');
    const auth = require('./authController');
    const auditManager = require('./trailController');
    const fileUpload = require('../middleware/fileupload');
    const docUpload = require('../middleware/docUpload')
    require('dotenv').config();

    

    


    
 const postUpload =  (req,res, next)=>{

        const {title,description} = req.body

        const doc_one = `${process.env.BASE_URL}/documents/${req.files['doc_one'][0].filename}`
        
        const doc_two = `${process.env.BASE_URL}/documents/${req.files['doc_two'][0].filename}`
        
        const doc_three = `${process.env.BASE_URL}/documents/${req.files['doc_three'][0].filename}`

        const doc_four = `${process.env.BASE_URL}/documents/${req.files['doc_four'][0].filename}`

        const cac = `${process.env.BASE_URL}/documents/${req.files['cac'][0].filename}`
 

        
        var result =[title, description,doc_one, doc_two, doc_three, doc_four, cac]
        

        // if(req.data.data.roleId == 2){


            connection.query(`insert into upload_document (userId, title, description, doc_one, doc_two, doc_three,doc_four, cac) 
            values
            (
             '${req.data.data.id}',
            '${title}', 
            '${description}',
            '${doc_one}', 
            '${doc_two}', 
            '${doc_three}'
            '${doc_four}',
            '${cac}')`,(err, response)=>{
               if(err){
                   console.log(err)
                   trail={
                    moduleId: "11",
                    actor: `${req.body.email}`,
                    action: `${req.body.email} doc upload failed `,
                    status: "failed"
                }
                auditManager.logTrail(trail);
               }else{
                
                trail={
                    moduleId: "11",
                    actor: `${req.body.email}`,
                    action: `${req.body.email} doc upload successful `,
                    status: "success"
                }
                auditManager.logTrail(trail);
                //    res.send(response)
               }
   
   
   
   
            })
            
       
            res.send(result)

        // } else{
        //     res.send('info not match')
        // }
       

       

    }


const getDocPath = (req,res, next)=>{


    const filePath = req.params.path;
    const directoryPath = __basedir + "/uploads/documents/"
    res.download(directoryPath + filePath, (err)=>{
        if(err){
            res.status(500).send(
                {
                    message:"could not download the file" + err,
                }
            )
        }


    })


}
    // Attachment download
// const downloadAttachment = (req, res) => {
//     const filePath = req.params.path;
//     const directoryPath =  __basedir + "/uploads/documents/"  
//     res.download(directoryPath + filePath, (err) => {
//       if (err) {
//         res.status(500).send({
//           message: "Could not download the file. " + err,
//         });
//       }
//     });
//   };
// // file path
// // router.get('/attachment/:path', fileControllers.downloadAttachment);
// // router.get('/users/:path', fileControllers.userProfile);
//   // var pic = req.file.filename;
//   // var filePath = `${process.env.BASE_URL}/files/users/${pic}`
// const userProfile = (req, res) => {
//     const filePath = req.params.path;
//     const directoryPath =  __basedir + "/uploads/documents/"
//     res.sendFile(directoryPath + filePath, (err) => {
//       if (err) {
//         res.status(500).send({
//           message: "Could not load the image " + err,
//         });
//       }
//     });
//   };


// module.exports = {
//   downloadAttachment,
//   userProfile
// };







  const getUploadAdmin = (req,res, next)=>{

        if(req.data.data.roleId == 1){
            connection.query('select * from documents',(err, response)=>{

                if(err) throw err
                res.send(response)
            })

        }else{
            res.send('You have not been authorized to perform this function').status(403)
        }

       




     }


   const getUploadByIdAdmin = (req, res, next)=>{


        if (req.body.data.roleId == 1){
            connection.query(`select * from documents where id= ${req.params.id}`, (err, response)=>{
                if(err){
                    res.send(err)
    
                }else{
    
                    res.send(response)
                }
    
    
    
            })
        } else{
            res.send('You have not been authorized to perform this function').status(403)
        }
       
        



     }

      const deleteUploadById = (req, res, next)=>{
        if(req.data.data.roleId == 1){
            connection.query(`delete from documents where id = ${req.params}`, (err, response)=>{
                if(err){
                    res.send(err)
                }else{

                    res.send(response)


                }



            })


        }



     }




module.exports = {postUpload,docUpload, getUploadAdmin, getUploadByIdAdmin, getDocPath, deleteUploadById}


