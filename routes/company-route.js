// Required files
const express = require('express');


// Required Controller
const companyController  =require('../controllers/companyController');

// const auth = require('../controllers/authController');


const router = express.Router();

router.get('/search/business', companyController.searchBusiness)

router.get('/search/category', companyController.searchCategory)

router.get('/search/state', companyController.searchState)



module.exports = router;