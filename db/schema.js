// Require Mongoose
var mongoose = require('mongoose');

// Instantiate a name space for the Schema Constructor
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Define Schema for cards
var CardSchema = new Schema({
  cardType: String,
  cardName: String,
  flavorText: String,
  actions: [],
  fortuneMod: Number,
  sanityMod: Number,
  moonMod: Number
});

// Set models in Mongoose utilizing the Schema
var CardSchema = mongoose.model("Card", CardSchema);
