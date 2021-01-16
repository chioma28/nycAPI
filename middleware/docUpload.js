const fileUpload = require('../middleware/fileupload');
   
    const docUpload = fileUpload.fields([{ name: 'doc_one', maxCount: 1 }, 
    { name: 'doc_two', maxCount: 1 }, 
    { name: 'doc_three', maxCount: 1 },
    { name: 'doc_four', maxCount: 1 },
    { name: 'cac', maxCount: 1 }])




    module.exports = docUpload