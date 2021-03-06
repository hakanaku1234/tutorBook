const express = require("express");
var session = require('express-session');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const http = require('http');
const passport = require('passport');
const passportConfig = require('./config/passport')
const application = require('./routes/api/application');
const db = require("./models");

const PORT = process.env.PORT || 3001;

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve up static assets

  app.use(express.static("client/build"));
  // Add routes, both API and view

  // app.get('/', function (request, response) {
  //   response.send('Hello World!');
  // });
  
app.use(routes);

//PASSPORT.JS related
app.use(session({
  secret: 'baobaorocks',
  resave: false,
  saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/authenticate',passport.authenticate('local',{
  successRedirect: '/login',
  failureRedirect: '/'
  })
)

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/baobaoBook",{useMongoClient: true}).then(function(db,err) {
  if (err) {
    console.log(err)
  }
  console.log(`Connected to ${db.name} on port ${db.port}`)
  app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });
})
 
