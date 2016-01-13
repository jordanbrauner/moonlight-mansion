$(document).ready(function() {

  // Set Variables
  eventDeck = [];
  itemDeck = [];
  eventCard = [];
  inventory = [];
  discarded = [];
  sanityLevel = 10;
  moonLevel = 1;

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
      $("#card-wrapper #room-type").html("Choose a room");

      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      console.log("Game started");

      // $("#shuffle").on("click", function() {
      //   game.shuffleDeck(eventDeck);
      //   game.shuffleDeck(itemDeck);
      //   game.renderHUD(eventDeck);
      //   game.renderHUD(itemDeck);
      //   console.log(eventDeck);
      // });
      //
      // $("#draw-event-card").on("click", function() {
      //   game.drawEventCard(eventDeck);
      // });
      // $("#draw-item-card").on("click", function() {
      //   game.drawItemCard(itemDeck);
      // });

      game.renderHUD();
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
        console.log("********* NEW TURN *********");
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
        game.renderHUD();
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
        game.renderHUD();
      } else {
        console.log("You need to discard a card from your inventory first");
        // TODO run discard inventory function and then re-run drawItemCard
      }
    },

    /////////////////////////////////////////////////////////////////////////
    discardItemCard: function(numToDiscard) {
    /////////////////////////////////////////////////////////////////////////
      console.log("Future action for discarding a card from your inventory.");
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
        game.fortuneHardship(fortuneEffects);
        console.log("About to call discardEventCard with the following card: " + eventCard[0].cardName);
        game.discardEventCard(eventCard[0]);
      } else if (result === "f") {
        var hardshipEffects = eventCard[0].actions.action1.hardship;
        game.fortuneHardship(hardshipEffects);
        console.log("About to call discardEventCard with the following card: " + eventCard[0].cardName);
        game.discardEventCard(eventCard[0]);
      } else {
        console.log("(action1result) Error: The result was neither a success or failure.");
      }
    },

    /////////////////////////////////////////////////////////////////////////
    action2Result: function() {
    /////////////////////////////////////////////////////////////////////////
      var avoidEffects = eventCard[0].actions.action2.a2Result;
      console.log("avoidEffects: " + avoidEffects);
      game.fortuneHardship(avoidEffects);
      game.discardEventCard(eventCard[0]);
    },

    /////////////////////////////////////////////////////////////////////////
    action3Result: function() {
    /////////////////////////////////////////////////////////////////////////
      console.log("Choose the item you want to use.");
    },

    /////////////////////////////////////////////////////////////////////////
    fortuneHardship: function(effects) {
    /////////////////////////////////////////////////////////////////////////

      // TODO Make this code WAY MORE DRY

      console.log("About to resolve the following effects: " + effects);
      for (var e = 0; e < effects.length; e++) {
        if (effects[e] === "itemU1") {
          game.drawItemCard(1);
        } else if (effects[e] === "itemU2") {
          game.discardItemCard(2);
        } else if (effects[e] === "itemD1") {
          game.discardItemCard(-1);
        } else if (effects[e] === "itemD2") {
          game.discardItemCard(-2);
        } else if (effects[e] === "itemD3") {
          game.discardItemCard(-3);
        } else if (effects[e] === "itemD4") {
          game.discardItemCard(-4);
        } else if (effects[e] === "sanityU1") {
          game.sanityCheck(1);
        } else if (effects[e] === "sanityU2") {
          game.sanityCheck(2);
        } else if (effects[e] === "sanityU3") {
          game.sanityCheck(3);
        } else if (effects[e] === "sanityU4") {
          game.sanityCheck(4);
        } else if (effects[e] === "sanityD1") {
          game.sanityCheck(-1);
        } else if (effects[e] === "sanityD2") {
          game.sanityCheck(-2);
        } else if (effects[e] === "sanityD3") {
          game.sanityCheck(-3);
        } else if (effects[e] === "sanityD4") {
          game.sanityCheck(-4);
        } else if (effects[e] === "moonU1") {
          game.moonCheck(1);
        } else if (effects[e] === "moonU2") {
          game.moonCheck(2);
        } else if (effects[e] === "moonU3") {
          game.moonCheck(3);
        } else if (effects[e] === "moonU4") {
          game.moonCheck(4);
        } else if (effects[e] === "moonD1") {
          game.moonCheck(-1);
        } else if (effects[e] === "moonD2") {
          game.moonCheck(-2);
        } else if (effects[e] === "moonD3") {
          game.moonCheck(-3);
        } else if (effects[e] === "moonD4") {
          game.moonCheck(-4);
        } else {
          console.log("Effect not found: " + effects[e]);
        }
        game.renderHUD();
      }
    },

    /////////////////////////////////////////////////////////////////////////
    sanityCheck: function(num) {
    /////////////////////////////////////////////////////////////////////////
    console.log("About to adjust the sanity level by " + num);
      if (num > 0) {
        if (sanityLevel + num <= 10) {
          sanityLevel += num;
        } else {
          console.log("Sanity is full");
        }
      } else if (num < 0) {
        sanityLevel += num;
        if (sanityLevel <= 0) {
          game.gameOver();
        }
      }
    },

    /////////////////////////////////////////////////////////////////////////
    moonCheck: function(num) {
    /////////////////////////////////////////////////////////////////////////
    console.log("About to adjust the moon level by " + num);
      if (num > 0) {
        moonLevel += num;
        if (moonLevel >= 25) {
          game.gameOver();
        }
      } else if (num < 0) {
        if (moonLevel - num >= 1) {
          moonLevel += num;
        } else {
          console.log("Moon level can't go lower");
        }
      }
    },

    /////////////////////////////////////////////////////////////////////////
    renderHUD: function() {
    /////////////////////////////////////////////////////////////////////////
      // Clear HUD
      $("#event-deck").html("");
      $("#item-deck").html("");
      $("#discarded").html("");
      $("#inventory-temp").html("");
      $("#sanity-level").html("");
      $("#moon-level").html("");

      // Update HUD
      $("#sanity-level").html(sanityLevel);
      $("#moon-level").html(moonLevel);

      // Update Debug Footer
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
