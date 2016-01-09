// REQUIRE
require('../db/schema');
var mongoose = require('mongoose');

// DEFINE
var CardModel = mongoose.model("Card");

// EXPORT
module.exports = CardModel;
