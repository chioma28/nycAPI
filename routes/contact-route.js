const express = require('express');
 const auth = require('../controllers/authController');

 const contactController = require('../controllers/contactController');
 const sendMail = require('../middleware/mail');

 const router = express.Router()


 router.get('/contact', contactController.getContact);//getting the contacts in the database

 router.post('/contact', contactController.postContact);//posting information to the db and company mail.



 module.exports = router