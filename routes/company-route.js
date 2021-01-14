// Required files
const express = require('express');


// Required Controller
const companyController  =require('../controllers/companyController');

// const auth = require('../controllers/authController');


const router = express.Router();

router.post('/search/business', companyController.searchBusiness)

router.post('/search/category', companyController.searchCategory)

router.post('/search/state', companyController.searchState)



module.exports = router;