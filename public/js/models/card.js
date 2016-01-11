var Card = function(info) {
  this.cardType = info.cardType;
  this.roomType = info.roomType;
  this.cardName = info.cardName;
  this.flavorText = info.flavorText;
  this.useItem = info.useItem;
  this.useItem.itemFate = info.useItem.itemFate;
  this.useItem.itemResult = info.useItem.itemResult;
  this.actions = info.actions;
  this.actions.action1 = info.actions.action1;
  this.actions.action1.actionFate = info.actions.action1.actionFate;
  this.actions.action1.fortune = info.actions.action1.fortune;
  this.actions.action2.hardship = info.actions.action2.hardship;
  this.actions.action3 = info.actions.action3;
};

Card.fetch = function() {
  var url = "http://localhost:4000/cards";
  var request = $.getJSON(url).then(function(response) {
    var cards = [];
    for (var i = 0; i < response.length; i++) {
      cards.push(new Card(response[i]));
    }
    console.log("Here are the cards retrieved from the JSON request: " + cards);
    return cards;
  }).fail (function(response) {
    console.log("Cards fetch failed");
  });
  return request;
};
