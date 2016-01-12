$(document).ready(function() {

  // the 'cards' global variable containing all cards fetched from the server is also available
  var deck = [];
  var inventory = [];
  var discardPile = [];

  // Make JSON call and render each card inside its own div
  Card.fetch().then(function(cards) {
    cards.forEach(function(card) {
      // var view = new CardView(card);
      // view.render();
      // Add each card to the variable 'deck'
      // deck.push(card);
    });
  }).then(function() {
    game.startGame();
  });

  var game = {

    startGame: function() {
      // Initial shuffle
      game.shuffleDeck(cards);
      // TODO Fill the map with cards for each tile in the map
      // TODO Add Event Listeners for map tiles, inventory, player actions
      $("#map-placeholder").on("click", function() {
        game.drawCard();
      });
      console.log("Game started");
      
      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      $("#shuffle").on("click", function() {
        game.shuffleDeck(deck);
      });
    },

    shuffleDeck: function(cardsToShuffle) {
      // Clear all-cards div
      $(".all-cards").html("");
      // Shuffle all cards from deck randomly into deck
      var cardsLeft = cardsToShuffle.length;
      var i;
      while (cardsLeft) {
        i = Math.floor(Math.random() * cardsLeft--);
        deck.push(cardsToShuffle.splice(i, 1)[0]);
      }
      console.log("Cards have been shuffled: " + deck);
      deck.forEach(function(card) {
        var view = new CardView(card);
        view.render();
      });
      return deck;
    },

    drawCard: function() {
      console.log("Drawing a card from the deck: " + deck[0].cardType);
    }
  };

});
