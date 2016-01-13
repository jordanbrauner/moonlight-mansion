$(document).ready(function() {

  // Set Variables
  eventDeck = [];
  itemDeck = [];
  eventCard = [];
  inventory = [];
  discarded = [];
  sanity = 10;
  moon = 0;

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
      game.mapClick();

      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      console.log("Game started");

      // $("#shuffle").on("click", function() {
      //   game.shuffleDeck(eventDeck);
      //   game.shuffleDeck(itemDeck);
      //   game.renderFooterCards(eventDeck);
      //   game.renderFooterCards(itemDeck);
      //   console.log(eventDeck);
      // });
      //
      // $("#draw-event-card").on("click", function() {
      //   game.drawEventCard(eventDeck);
      // });
      // $("#draw-item-card").on("click", function() {
      //   game.drawItemCard(itemDeck);
      // });

      game.renderFooterCards();
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
        if (toShuffle[i].cardType === "event") {
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
    mapClick: function() {
    /////////////////////////////////////////////////////////////////////////
      $(".map").on("click", function(event) {
        console.log("********* NEW TURN *********")
        var tileNumber = $(event.target).attr("id") - 1;
        if (eventCard.length === 0 && eventDeck[tileNumber] !== "drawn") {
          console.log("Drawing card from the eventDeck with the id of " + tileNumber + ".");
          $(event.target).removeClass("unvisited");
          $(event.target).addClass("visited");
          game.drawEventCard(tileNumber);
        } else if (eventDeck[tileNumber] === "drawn") {
          console.log("You already drew this card.");
        } else {
          console.log("You must resolve the current event first.");
        }
      });
    },

    /////////////////////////////////////////////////////////////////////////
    drawEventCard: function(tileNumber) {
    /////////////////////////////////////////////////////////////////////////
      if (eventDeck.length > 0 && eventCard.length < 1) {
        eventCard.push(eventDeck.splice(tileNumber, 1, "drawn")[0]);
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
          game.meetYourFate();
        });

        // Action 2
        $("#a2-name").html(drawnCard.actions.action2.a2Name);
        $("#a2-result").html(drawnCard.actions.action2.a2Result);

        $("#action-2").on("click", function() {
          console.log("Action 2 clicked");
          if (eventCard.length != 1) {
            console.log("No event card in play!");
          } else {
            game.action2Result();
          }
        });

        // Action 3
        $("#a3-name").html(drawnCard.actions.action3.a3Name);
        $("#a3-result").html(drawnCard.actions.action3.a3Result);

        $("#action-3").on("click", function() {
          console.log("Action 3 clicked");
          game.action3Result();
        });

        // TEST Update footer
        game.renderFooterCards();
      } else {
        console.log("Either you must pick an action on your current card or you are trying to draw an event card but the deck is empty.");
      }
    },

    /////////////////////////////////////////////////////////////////////////
    discardEventCard: function() {
    /////////////////////////////////////////////////////////////////////////
      console.log("About to run through the actions within discardEventCard with the following card: " + eventCard[0].cardName);
      discarded.push(eventCard.splice(0, 1)[0]);
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
      if (itemDeck.length > 0 && inventory.length < 4) {
        inventory.push(itemDeck.splice(0, 1)[0]);
        var newItem = inventory[inventory.length - 1];
        $("#inventory-temp").append("<div><p>" + newItem.cardName + "</p></div>");
        game.renderFooterCards();
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
    meetYourFate: function() {
    /////////////////////////////////////////////////////////////////////////
      var meetYourFate = prompt("'S' for success. 'F' for failure");
      if (meetYourFate === "s" || meetYourFate === "S") {
        game.action1Result("s");
      } else if (meetYourFate === "f" || meetYourFate === "F") {
        game.action1Result("f");
      } else {
        console.log("Uh oh. There's been an error in action1result!");
      }
    },

    /////////////////////////////////////////////////////////////////////////
    action1Result: function(result) {
      /////////////////////////////////////////////////////////////////////////
      if (result === "s") {
        var fortuneEffects = eventCard[0].actions.action1.fortune;
        game.fortuneHardship("fortune", fortuneEffects);
        console.log("About to call discardEventCard with the following card: " + eventCard[0].cardName);
        game.discardEventCard(eventCard[0]);
      } else if (result === "f") {
        var hardshipEffects = eventCard[0].actions.action1.hardship;
        game.fortuneHardship("hardship", hardshipEffects);
        console.log("About to call discardEventCard with the following card: " + eventCard[0].cardName);
        game.discardEventCard(eventCard[0]);
      } else {
        console.log("(action1result) Error: The result was neither a success or failure.");
      }
    },

    /////////////////////////////////////////////////////////////////////////
    action2Result: function() {
    /////////////////////////////////////////////////////////////////////////
      game.discardEventCard(eventCard[0]);
      game.renderFooterCards();
    },

    /////////////////////////////////////////////////////////////////////////
    action3Result: function() {
    /////////////////////////////////////////////////////////////////////////
      console.log("Choose the item you want to use.");
    },

    /////////////////////////////////////////////////////////////////////////
    fortuneHardship: function(fortuneOrHardship, effects) {
    /////////////////////////////////////////////////////////////////////////
      console.log("About to resolve the following " + fortuneOrHardship + "effects: " + effects);
      if (fortuneOrHardship === "fortune") {
        console.log(effects);
        console.log("Effects array index 0 if fortune: " + effects[0]);
      } else if (fortuneOrHardship === "hardship") {
        console.log("Effects Array if hardship: " + effects);
      } else {
        console.log("(fortuneHardship function) There's been an error with this function's input. fortuneOrHardship: " + fortuneOrHardship + ". effectsArray: "+ effectsArray);
      }
    },

    /////////////////////////////////////////////////////////////////////////
    renderFooterCards: function() {
    /////////////////////////////////////////////////////////////////////////
      $("#event-deck").html("");
      $("#item-deck").html("");
      $("#discarded").html("");
      $("#inventory-temp").html("");
      eventDeck.forEach(function(card) {
        $("#event-deck").append("<div><p>" + card.cardName + "</p></div>");
      });
      itemDeck.forEach(function(card) {
        $("#item-deck").append("<div><p>" + card.cardName + "</p></div>");
      });
      discarded.forEach(function(card) {
        $("#discarded").append("<div><p>" + card.cardName + "</p></div>");
      });
      inventory.forEach(function(card) {
        $("#inventory-temp").append("<div><p>" + card.cardName + "</p></div>");
      });

    }
  };

});
