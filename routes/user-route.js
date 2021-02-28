// Required files
const express = require('express');
const multer  =require('multer');
const path = require('path');


// Required Controller
const userController  =require('../controllers/userController');
const auth = require('../controllers/authController')
// const infocheck = require('../middleware/infoCheck')
const { check, validationResult } = require('express-validator');//validator

// const auth = require('../controllers/authController');


const router = express.Router();



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

// Router

router.get('/admin', auth.authenticate,userController.getAllUser)

router.get('/admin/:id', auth.authenticate, userController.getUserId)

router.get('/users/:id', auth.authenticate, userController.getUserByUser)



 router.post('/signup', 
 //[ 
//     ///validation
//     check('email', 'invalid email,please put in a valid email') 
//                     .isEmail(), 
//     check('businessName', 'Business name length should not be less than 5 characters') 
//                     .isLength({ min: 6}), 
//     check('password', 'Password length should not be less than 8 characters') 
//     .isLength({ min : 8 })
//   ], 
userController.userSignup)

router.get('/auth/activation', userController.authActivate)

router.put('/users/profile', auth.authenticate, upload.single("image"), userController.userUpdateRecords)


router.delete('/admin/:id', auth.authenticate, userController.adminDeleteRecord)

router.post('/login', userController.userLogin)


//router.put('/users/profile/picture/:id', auth.authenticate,upload.single("image"), userController.updateProfilePic)

router.get('/users/profile/picture/:id', auth.authenticate, userController.viewProfilePic)


router.delete('/users/profile/picture/:id', auth.authenticate, userController.deleteProfilePic)

router.post('/forgotPassword',  userController.forgotPassword)


router.post('/reset', auth.forgotPassword,  userController.resetPassword)






module.exports = router;