// REQUIRE
var express = require('express');
var mongoose = require('mongoose');
var cardsController = require('./controllers/cardsController.js');

// CONFIGURE
mongoose.connect('mongodb://localhost');
var app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// RUN APP
app.listen(4000, function() {
  console.log("App listening on port " + this.address().port);
});

// ROUTES
// Root
app.get("/", function(req, res) {
  res.render("index.html");
});
