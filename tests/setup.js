jest.setTimeout(5000); // default is 5000 which is 5 sec
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI,{useMongoClient: true});