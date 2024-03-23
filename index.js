const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();
const errorsMiddleware = require('./middlewares/error');

global.__basedir = __dirname;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// use it before all route definitions
app.use(cors({ origin: '*' }));

//routes
app.use(require('./routes/index'));
app.use(errorsMiddleware)

app.listen(process.env.PORT || 4000);
console.log('Server listening port: ', process.env.PORT || 4000);