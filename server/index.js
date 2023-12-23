const { readdirSync } = require('fs');
const express = require('express');
const app = express();

const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const hbs = require('nodemailer-express-handlebars');
app.use(express.static(path.join(__dirname, './public')))

app.use(express());
app.use(helmet());
app.use(rateLimit());
app.use(hpp());
app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb'}));
app.use(mongoSanitize());
app.use(bodyParser.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
app.use(limiter);

// data base password and user name
const pass = process.env.PASS;
const user = process.env.USER;



readdirSync('./src/routes').map(file => app.use('/api/v1', require(`./src/routes/${file}`)))


const URL = 'mongodb+srv://<username>:<password>@cluster0.opjq5jn.mongodb.net/taskmanager';
const OPTIONS = { user: user, pass: pass, autoIndex: true };

mongoose
  .connect(URL,OPTIONS)
  .then( () => {
    console.log('database connection established and successfully connected');
  }).catch(error => {
    console.log(error);
  })

  // not found and unauthorized Url------------------
app.get("*", (req, res) => {
  res.status(404).json({
    data: "not found",
    massage: "unauthorized"
    })
  })



module.exports = app;
