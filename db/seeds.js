// REQUIRE
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost');
var CardModel = require('../models/card');

// Drop if needed
CardModel.remove({}, function(err) {
  console.log(err);
});

// Seed data
var r1c1 = new CardModel({
  cardType: "Observatory",
  cardName: "A Cloudless Sky",
  flavorText: "Sitate eos sequisc imaximi ntinctem in conse omnim voluptume volupta consequis se omnis esed quiatin. Epuda sam quidernatur simolorum.",
  actions: {
    "Look through the telescope": encounter,
    "Leave the room": leave,
    "Brief respite": respite
  }
});

// var actions = new ActionModel({
//
// });
//
// var cards = [r1c1];
// for (var i = 0; i < cards.length; i++) {
//   cards[i].push
// }
