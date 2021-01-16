const express = require('express');
 const auth = require('../controllers/authController')
 const fileUpload = require('../middleware/fileupload');

 const docUpload = require('../middleware/docUpload')

const uploadDocumentController = require('../controllers/uploadDocumentController');




const router = express.Router();

router.post('/upload', docUpload, uploadDocumentController.postUpload)

router.get('/upload/documents/:path', uploadDocumentController.getDocPath)

router.get('/upload', auth.authenticate, uploadDocumentController.getUploadAdmin)

router.get('/upload/:id', auth.authenticate, uploadDocumentController.getUploadByIdAdmin)

router.delete('/upload/:id', auth.authenticate, uploadDocumentController.deleteUploadById)


module.exports = router