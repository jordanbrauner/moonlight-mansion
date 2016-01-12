$(document).ready(function() {

  // Set Variables
  eventDeck = [];
  itemDeck = [];
  eventCard = [];
  inventory = [];
  discarded = [];

  // Fetch JSON card data
  Card.fetch().then(function() {
    game.playGame();
  });

  var game = {

    /////////////////////////////////////////////////////////////////////////
    startMenu: function() {
    /////////////////////////////////////////////////////////////////////////
    },

    /////////////////////////////////////////////////////////////////////////
    playGame: function() {
    /////////////////////////////////////////////////////////////////////////
      game.shuffleDeck(itemDeck);
      game.shuffleDeck(eventDeck);

      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      console.log("Game started");

      $("#shuffle").on("click", function() {
        game.shuffleDeck(eventDeck);
        game.shuffleDeck(itemDeck);
        game.renderFooterCards(eventDeck);
        game.renderFooterCards(itemDeck);
        console.log(eventDeck);
      });

      $(".map").on("click", function(event) {
        $(event.target).addClass("visited");
      });

      $("#draw-event-card").on("click", function() {
        game.drawEventCard(eventDeck);
      });
      $("#draw-item-card").on("click", function() {
        game.drawItemCard(itemDeck);
      });

      game.renderFooterCards(eventDeck);
      game.renderFooterCards(itemDeck);
    },

    /////////////////////////////////////////////////////////////////////////
    shuffleDeck: function(toShuffle, discarded) {
    /////////////////////////////////////////////////////////////////////////
      console.log("Shuffling " + toShuffle[0].cardType + " deck!");
      $(".all-cards").html("");
      for (var num in discarded) {
        toShuffle.push(discarded[num]);
        console.log("Pushing " + discarded[num].cardName + "to the toShuffle deck");
      }
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
    drawEventCard: function() {
    /////////////////////////////////////////////////////////////////////////
      if (eventDeck.length > 0) {
        eventCard.push(eventDeck.splice(0, 1)[0]);
        var drawnCard = eventCard[0];
        $("#card-wrapper #room-type").html(drawnCard.roomType);
        $("#card-wrapper .card-name").html(drawnCard.cardName);
        $("#card-wrapper .flavor-text").html(drawnCard.flavorText);

        // Action 1
        $("#a1-name").html(drawnCard.actions.action1.a1Name);
        $("#a1-fortune").html("<strong>Fortune: </strong>" + drawnCard.actions.action1.fortune);
        $("#a1-hardship").html("<strong>Hardship: </strong>" + drawnCard.actions.action1.hardship);

        $("#action-1").on("click", function() {
          console.log("Action 1 clicked");
          game.action1Result(eventCard);
        });

        // Action 2
        $("#a2-name").html(drawnCard.actions.action2.a2Name);
        $("#a2-result").html(drawnCard.actions.action2.a2Result);

        $("#action-2").on("click", function() {
          console.log("Action 2 clicked");
          game.action2Result(eventCard);
        });

        // Action 3
        $("#a3-name").html(drawnCard.actions.action3.a3Name);
        $("#a3-result").html(drawnCard.actions.action3.a3Result);

        $("#action-3").on("click", function() {
          console.log("Action 3 clicked");
          game.action3Result(eventCard);
        });

        // TEST Update footer
        game.renderFooterCards();
      } else {
        console.log("The event card deck is empty!");
      }
    },

    /////////////////////////////////////////////////////////////////////////
    discardEventCard: function(card) {
    /////////////////////////////////////////////////////////////////////////
      discarded.push(card.splice(0, 1)[0]);
      var justAdded = discarded.length - 1;
      console.log("Card discarded: " + discarded[justAdded].cardName);
      $("#card-wrapper #room-type").html("");
      $("#card-wrapper .card-name").html("");
      $("#card-wrapper .flavor-text").html("");

      $("#a1-name").html("");
      $("#a1-fortune").html("");
      $("#a1-hardship").html("");

      $("#a2-name").html("");
      $("#a2-result").html("");

      $("#a3-name").html("");
      $("#a3-result").html("");
    },

    /////////////////////////////////////////////////////////////////////////
    drawItemCard: function() {
    /////////////////////////////////////////////////////////////////////////
      if (inventory.length < 5) {
        inventory.push(itemDeck.splice(0, 1)[0]);
      } else {
        console.log("You need to discard a card from your inventory first");
        // TODO run discard inventory function and then re-run drawItemCard
      }
    },

    /////////////////////////////////////////////////////////////////////////
    renderInventory: function() {
    /////////////////////////////////////////////////////////////////////////
    },

    /////////////////////////////////////////////////////////////////////////
    action1Result: function(card) {
    /////////////////////////////////////////////////////////////////////////
      // Call Meet Your Fate function
      // Then
      game.discardEventCard(card);
    },

    /////////////////////////////////////////////////////////////////////////
    meetYourFate: function() {
    /////////////////////////////////////////////////////////////////////////

    },

    /////////////////////////////////////////////////////////////////////////
    action2Result: function(card) {
    /////////////////////////////////////////////////////////////////////////
      game.discardEventCard(card);
    },

    /////////////////////////////////////////////////////////////////////////
    action3Result: function(card) {
    /////////////////////////////////////////////////////////////////////////
      console.log("Choose the item you want to use.");
    },

    /////////////////////////////////////////////////////////////////////////
    renderFooterCards: function() {
    /////////////////////////////////////////////////////////////////////////
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
