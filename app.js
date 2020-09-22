const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');


const { userRoutes, articleRoutes } = require('./routes');

const app = express();


const mongoose = require('mongoose');
const dev_db_url = 'mongodb+srv://kornet98:123qwerty@cluster0.bvfpl.mongodb.net/mongoHW';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true };
mongoose.connect(mongoDB, dbOptions);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(userRoutes);
app.use(articleRoutes);

// error-handler settings
require('./config/error-handler')(app)

const port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
