// Require Mongoose
var mongoose = require('mongoose');

// Instantiate a name space for the Schema Constructor
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// Define Schema for cards
var CardSchema = new Schema(
  {
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
        a1Name: String,
        actionFate: Number,
        fortune: [],
        hardship: []
      },
      action2: {
        a2Name: String,
        a2Result: []
      },
      action3: {
        a3Name: String,
        a3Result: String
      }
    }
  },
  {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
  }
);

CardSchema.virtual("id").get(function() {
  return this._id;
});

// Set models in Mongoose utilizing the Schema
var CardModel = mongoose.model("Card", CardSchema);
