$(document).ready(function() {

  // Set Variables
  eventDeck = [];
  itemDeck = [];
  var eventCard = [];
  var inventory = [];
  var discarded = [];

  // Fetch JSON card data
  Card.fetch().then(function() {
    game.playGame();
  });

  var game = {
    /////////////////////////////////////////////////////////////////////////
    // Adds event listener that starts game on click.
    /////////////////////////////////////////////////////////////////////////
    startMenu: function() {
      $("nav").on("click", function() {
        game.playGame();
      });
    },

    /////////////////////////////////////////////////////////////////////////
    // Calls shuffleDeck, adds event listeners, populates map.
    /////////////////////////////////////////////////////////////////////////
    playGame: function() {
      game.shuffleDeck(itemDeck);
      game.shuffleDeck(eventDeck);

      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      game.drawEventCard(eventDeck);
      console.log("Game started");

      $("#shuffle").on("click", function() {
        game.shuffleDeck(eventDeck);
        game.shuffleDeck(itemDeck);
        game.renderFooterCards(eventDeck);
        game.renderFooterCards(itemDeck);
        console.log(eventDeck);
      });

      $("#draw-card").on("click", function() {
        game.drawEventCard(eventDeck);
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
    // Draw and render Card is called whenever the player clicks a map tile to move to.
    /////////////////////////////////////////////////////////////////////////
    drawEventCard: function() {
      eventCard.push(eventDeck.splice(0, 1)[0]);
      console.log("This is the card in drawEventCard function: " + eventCard[0].cardName);
      $("#card-text > h2").html(eventCard[0].cardName);
      $("#card-text > h3").html(eventCard[0].flavorText);
      $("#card-text > h3").html(eventCard[0].flavorText);

      $("#action-1 > h2").html(eventCard[0]);
    },

    /////////////////////////////////////////////////////////////////////////
    // Called to show cards in the footer. For testing purposes only.
    /////////////////////////////////////////////////////////////////////////
    renderFooterCards: function() {
      $("#event-deck").html("");
      $("#item-deck").html("");
      eventDeck.forEach(function(card) {
        $("#event-deck").append("<div><p>" + card.cardName + "</p></div>");
      });
      itemDeck.forEach(function(card) {
        $("#item-deck").append("<div><p>" + card.cardName + "</p></div>");
      });
    }
  };

});
