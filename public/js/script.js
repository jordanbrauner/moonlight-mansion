$(document).ready(function() {

  eventDeck = [];
  itemDeck = [];
  var eventCard = [];
  var inventory = [];
  var discarded = [];

  Card.fetch().then(function() {
    // console.log(cards);
    // cards.forEach(function(card) {
    //   var view = new CardView(card);
    //   view.render();
      // deck.push(card);
    // });
  }).then(function() {
    game.startGame();
  });

  // Card.fetch().then(function(cards) {
    // cards.forEach(function(card) {
      // var view = new CardView(card);
      // view.render();
      // Add each card to the variable 'deck'
      // deck.push(card);
    // });
  // }).then(function() {
  //   game.waitToStart();
  // });

  var game = {

    /////////////////////////////////////////////////////////////////////////
    // Adds event listener that starts game on click.
    /////////////////////////////////////////////////////////////////////////
    waitToStart: function() {
      $("nav").on("click", function() {
        game.startGame();
      });
    },

    /////////////////////////////////////////////////////////////////////////
    // Calls shuffleDeck, adds event listeners, populates map.
    /////////////////////////////////////////////////////////////////////////
    startGame: function() {
      // console.log("item cards before shuffle" + cards.itemCards);
      // console.log("event cards before shuffle" + cards.eventCards);
      game.shuffleDeck(cards.itemCards);
      game.shuffleDeck(cards.eventCards);
      // console.log("item cards after shuffle" + cards.itemCards);
      // console.log("event cards after shuffle" + cards.eventCards);
      // console.log("item deck after shuffle" + itemDeck);
      // console.log("event deck after shuffle" + eventDeck);
      // TODO Fill the map with cards for each tile in the map
      // TODO Add Event Listeners for map tiles, inventory, player actions
      $("#map-placeholder").on("click", function() {
        game.drawCard();
      });
      console.log("Game started");

      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      $("#shuffle").on("click", function() {
        game.shuffleDeck(eventDeck);
        console.log(eventDeck);

        // Place first card in deck in event column
        game.drawCard(eventDeck);
      });

    },

    /////////////////////////////////////////////////////////////////////////
    // Shuffles cards into the event or item deck.
    /////////////////////////////////////////////////////////////////////////
    shuffleDeck: function(toShuffle) {
      // Clear all-cards div
      $(".all-cards").html("");
      // Shuffle all cards from input randomly into item or event decks
      // console.log("toShuffle's cardType: " + toShuffle[0].cardType);
      var cardsLeft = toShuffle.length;
      var i;
      while (cardsLeft) {
        i = Math.floor(Math.random() * cardsLeft--);
        if (toShuffle[i].cardType == "event") {
          eventDeck.push(toShuffle.splice(i, 1)[0]);
        } else {
          itemDeck.push(toShuffle.splice(i, 1)[0]);
        }
        if (!cardsLeft) {
          return eventDeck || itemDeck;
        }
      }
    },

    /////////////////////////////////////////////////////////////////////////
    // Draw Card is called whenever the player clicks a map tile to move to.
    /////////////////////////////////////////////////////////////////////////
    drawCard: function() {
      eventDeck.push(eventCard.splice(0, 1)[0]);
      console.log("The event card is now: " + eventCard);
      // console.log("Drawing a card from the deck: " + deck[0].cardType);
    },

    /////////////////////////////////////////////////////////////////////////
    // Called to show cards in the footer. For testing purposes only.
    /////////////////////////////////////////////////////////////////////////
    renderFooterCards: function(cardsToRender) {
      cards.forEach(function(card) {
        var view = new CardView(card);
        view.render();
      });
    }
  };

});
