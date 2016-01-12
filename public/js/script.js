$(document).ready(function() {

  // the 'cards' global variable containing all cards fetched from the server is also available
  var deck = [];
  var shuffled = [];
  var discardPile = [];

  // Make JSON call and render each card inside its own div
  Card.fetch().then(function(cards) {
    cards.forEach(function(card) {
      var view = new CardView(card);
      view.render();
      // NOTE Add each card to the variable 'deck'
      deck.push(card);
    });
  }).then(function() {
    game.startGame();
  });

  var game = {

    startGame: function() {
      // Initial shuffle
      game.shuffleDeck(deck);
      // TODO Fill the map with cards for each tile in the map
      // TODO Add Event Listeners for map tiles, inventory, player actions
      $("#map-placeholder").on("click", function() {
        game.drawCard();
      });
      // NOTE Shuffle test
      $("#shuffle").on("click", function() {
        game.shuffleDeck(shuffled);
      });
      console.log("Game started");
    },

    shuffleDeck: function(cardsToShuffle) {
      console.log("Here is the deck of cards: " + deck);
      // Shuffle all cards from deck randomly into shuffled
      var cardsLeft = cardsToShuffle.length;
      var i;
      while (cardsLeft) {
        i = Math.floor(Math.random() * cardsLeft--);
        shuffled.push(cardsToShuffle.splice(i, 1)[0]);
      }
      return shuffled;
    },

    drawCard: function() {
      console.log("Drawing a card from the deck: " + deck[0].cardType);
    }
  };

});
