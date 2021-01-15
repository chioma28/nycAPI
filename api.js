//PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
var cors = require('cors');

//CONTROLLERS
var users = require('./controllers/userController');
var roles = require('./controllers/roleController');
var category = require('./controllers/categoryController');
var company = require('./controllers/companyController');
var permission = require('./controllers/permissionController');
var contact = require('./controllers/contactController');
var faq = require('./controllers/faqController');
var notification =  require('./controllers/notificationController');
var payment = require('./controllers/paymentController');
var advert = require('./controllers/advertController');
//var upload = require('./controllers/uploadDocumentController');


//ROUTES
const companyRoute = require('./routes/company-route');
//const userRoute = require('./routes/user-route');
//const contactRoute = require('./routes/contact-route');
//const uploadRoute = require('./routes/upload-route');

// var upload = require('./controllers/uploadDocumentController');
const PORT = process.env.PORT || 3000 || process.env.DB_PORT

// var corsOption = {
//     origin : ["https://naija-yellow-catalogue.herokuapp.com/",
//     ,"http://localhost:3000"],
//     methods: 'GET,POST,PUT,DELETE',
//     preflightContinue: false,
//     optionSuccessStatus: 200
// }
var whitelist = ["https://naija-yellow-catalogue.herokuapp.com","https://naija-yellow-catalogue.herokuapp.com/","http://localhost:3000"]

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/company', companyRoute);
//app.use('/api', userRoute);
//app.use('/api', contactRoute);
//app.use('/api/upload', uploadRoute);


app.get('/', (req, res) => {
    res.send("Welcome to yellow page")``
})
/*************************************** Instantiate Controllers **************************************/
users(app);
roles(app);
category(app);
//company(app);
//contact(app);
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