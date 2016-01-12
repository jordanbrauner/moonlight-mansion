// REQUIRE
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var hbs = require("hbs");

// CONFIGURE
mongoose.connect('mongodb://localhost/project4test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log("Connected");
});

app.set('view engine', 'hbs');
app.set('views', './public/js/views');
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.render("index");
});

app.use("/cards", require("./controllers/cardsController"));

// RUN APP
app.listen(4000, function() {
  console.log("App listening on port " + this.address().port);
});
