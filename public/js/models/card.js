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
  this.actions.action1.a1Name = info.actions.action1.a1Name;
  this.actions.action1.actionFate = info.actions.action1.actionFate;
  this.actions.action1.fortune = info.actions.action1.fortune;
  this.actions.action1.hardship = info.actions.action1.hardship;
  this.actions.action2 = info.actions.action2;
  this.actions.action2.a2Name = info.actions.action2.a2Name;
  this.actions.action2.a2Result = info.actions.action2.a2Result;
  this.actions.action3 = info.actions.action3;
  // this.actions.action3.a3Name = info.actions.action3.a3Name;
  // this.actions.action3.a3Result = info.actions.action3.a3Result;
  this.id = info.id;
};

// TODO Find alternative to using global variable for the JSON cards
cards = {
  eventCards: [],
  itemCards: []
};

Card.fetch = function() {
  var url = "http://localhost:4000/cards";
  var request = $.getJSON(url).then(function(response) {
    for (var i = 0; i < response.length; i++) {
      if (response[i].cardType == "event") {
        eventDeck.push(new Card(response[i]));
      } else {
        itemDeck.push(new Card(response[i]));
      }
    }
    return cards;
  }).fail (function(response) {
    console.log("Cards fetch failed");
  });
  return request;
};
