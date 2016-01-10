// Require Mongoose
var mongoose = require('mongoose');

// Instantiate a name space for the Schema Constructor
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Define Schema for cards
var CardSchema = new Schema({
  cardType: String,
  roomType: String,
  cardName: String,
  flavorText: String,
  useItem: {
    itemFate: Number,
    itemResult: []
  },
  actions: {
    action1: {
      actionFate: Number,
      fortune: [],
      hardship: []
    },
    action2: [],
    action3: String
  },
});

// Set models in Mongoose utilizing the Schema
var CardSchema = mongoose.model("Card", CardSchema);
