const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
var cors = require('cors');
var users = require('./controllers/userController');
var roles = require('./controllers/roleController');
var category = require('./controllers/categoryController');
var company = require('./controllers/companyController');
var permission = require('./controllers/permissionController');
var faq = require('./controllers/faqController');
var notification =  require('./controllers/notificationController');
var payment = require('./controllers/paymentController');
var advert = require('./controllers/advertController');
// var upload = require('./controllers/uploadDocumentController');
const PORT = process.env.PORT || 8600 || process.env.DB_PORT

var corsOption = {
    origin : ["https://naijayellowcatalogue.netlify.app", 
    "https://naija-yellow-catalogue.herokuapp.com/",
    "http://localhost:8600"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    optionSuccessStatus: 200
}
app = express();
app.use(bodyParser.json(),cors(corsOption));

app.get('/', (req, res) => {
    res.send("Welcome to yellow page")
})
/*************************************** Instantiate Controllers **************************************/
users(app);
roles(app);
category(app);
company(app);
permission(app);
faq(app);
notification(app);
payment(app);
advert(app);
// upload(app);

app.use((req, res, next) => {
    const error = new Error('Could not find this route');
    throw error;
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
})
/**************************************** Assign port *************************************************/

app.listen(PORT);
console.log(`Listening at ${PORT} `);