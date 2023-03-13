const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use it before all route definitions
app.use(cors({ origin: '*' }));

//routes
app.use(require('./src/routes/index'));

app.listen(process.env.PORT || 4000);
console.log('Server listening port: ', process.env.PORT || 4000);