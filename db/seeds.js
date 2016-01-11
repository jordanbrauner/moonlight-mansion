var schema = require("./schema");
var Card = require("../models/card");
var cardData = require("./card_data.json");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/project4test');
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Oops! Mongo threw an error. Is 'mongod' running?");
  console.log(err.message);
  process.exit();
});

db.once("open", function() {
  console.log("Connected to the database.");
  Card.remove({}).then(function() {
    forEach(cardData, function(cardDatum) {
      return new Card(cardDatum).save();
    }).then(function() {
      process.exit();
    });
  });
});

function forEach(collection, callback, index){
  if(!index) index = 0;
  return callback(collection[index]).then(function(){
    if(collection[index + 1]) return forEach(collection, callback, index + 1);
  });
}
