$(document).ready(function() {

  // Set Variables
  eventDeck = [];
  itemDeck = [];
  eventCard = [];
  inventory = [];
  discarded = [];
  sanityLevel = 10;
  moonLevel = 1;
  moonState = 1;
  fateMod = 0;
  canUseItem = false;
  actionPhase = false;

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

      game.renderHUD();
      console.log("Game started");

      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      $("#renderHUD").on("click", function() {
        game.renderHUD();
      });

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
        console.log("********* START OF TURN *********");
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
        actionPhase = true;

        $("#card-wrapper #room-type").html(drawnCard.roomType);
        $("#card-wrapper .card-name").html(drawnCard.cardName);
        $("#card-wrapper .flavor-text").html(drawnCard.flavorText);

        // Action 1
        $("#a1-name").html(drawnCard.actions.action1.a1Name);
        $("#a1-fortune").html("<strong>Fortune: </strong>" + drawnCard.actions.action1.fortune);
        $("#a1-hardship").html("<strong>Hardship: </strong>" + drawnCard.actions.action1.hardship);

        $("#action-1").on("click", function() {
          console.log("Action 1 clicked");
          if (actionPhase) {
            game.meetYourFate();
          }
        });

        // Action 2
        $("#a2-name").html(drawnCard.actions.action2.a2Name);
        $("#a2-result").html(drawnCard.actions.action2.a2Result);

        $("#action-2").on("click", function() {
          console.log("Action 2 clicked");
          if (eventCard.length != 1) {
            console.log("No event card in play!");
          } else if (actionPhase) {
            game.action2Result();
          }
        });

        // Action 3
        $("#a3-name").html(drawnCard.actions.action3.a3Name);
        $("#a3-result").html(drawnCard.actions.action3.a3Result);

        $("#action-3").on("click", function() {
          console.log("Action 3 clicked");
          if (actionPhase) {
            game.action3Result();
          }
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
      discarded.push(eventCard.splice(0, 1)[0]);
      var justAdded = discarded.length - 1;
      console.log("Card discarded: " + discarded[justAdded].cardName);
      $("#card-wrapper #room-type").html("Choose a room");
      $("#card-wrapper .card-name").html("");
      $("#card-wrapper .flavor-text").html("");

      $("#a1-name").html("");
      $("#a1-fortune").html("");
      $("#a1-hardship").html("");

      $("#a2-name").html("");
      $("#a2-result").html("");

      $("#a3-name").html("");
      $("#a3-result").html("");

      game.moonState();
    },

    /////////////////////////////////////////////////////////////////////////
    drawItemCard: function(num) {
    /////////////////////////////////////////////////////////////////////////
      if (itemDeck.length > 0 && inventory.length + num <= 4) {
        while (num) {
          console.log("Number of cards in the inventory: " + inventory.length);
          console.log("Drawing item card: " + itemDeck[0].cardName);
          inventory.push(itemDeck.splice(0, 1)[0]);
          console.log("Card placed in the inventory: " + inventory[inventory.length-1].cardName);
          var newItem = inventory[inventory.length-1];
          $("#inventory-wrapper").append(
            "<div class='select-container player-item' id='item-" + newItem.id + "'>" +
              "<div class='left-column'>" +
                "<h2>" + newItem.cardName + "</h2>" +
                "<p>" + newItem.flavorText + "</p>" +
              "</div>" +
              "<div class='right-column'></div>" +
            "</div>");

          var itemFate = newItem.useItem.itemFate;
          var itemResult = newItem.useItem.itemResult;
          var roomType = newItem.roomType;

          // console.log("Item Fate: " + itemFate);
          if (itemFate && roomType) {
            $("#item-" + newItem.id + " .right-column").append("<p>Increases fate in <strong>" + roomType + "</strong>: " + itemFate + "</p>");
          } else if (itemFate && !roomType) {
            $("#item-" + newItem.id + " .right-column").append("<p>Increases fate: " + itemFate + "</p>");
          }

          // console.log("Item Result: " + itemResult);
          if (itemResult) {
            $("#item-" + newItem.id + " .right-column").append("<p><strong>Modifies</strong>: " + itemResult + "</p>");
          }
          num -= 1;

          $("#item-" + newItem.id).on("click", function() {
            game.useAnItem(newItem.id);
          });

          // Debug footer
          $("#inventory-temp").append("<div><p>" + newItem.cardName + "</p></div>");
          game.renderHUD();
        }
      } else if (itemDeck.length <= 0) {
        console.log("There are no cards left in the item deck.");
      } else {
        console.log("You need to discard a card from your inventory first");
        discardItemCard();
      }
    },

    /////////////////////////////////////////////////////////////////////////
    discardItemCard: function(numToDiscard, card) {
    /////////////////////////////////////////////////////////////////////////
      console.log("Future action for discarding a card from your inventory.");
      // while (numToDiscard) {
      //   console.log("Item card to discard: " + card.cardName);
      //   numToDiscard -= 1;
      // }
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
      actionPhase = false;
      if (result === "s") {
        console.log("Player succeeded.");
        var fortuneEffects = eventCard[0].actions.action1.fortune;
        game.fortuneHardship(fortuneEffects);
        console.log("About to call discardEventCard with the following card: " + eventCard[0].cardName);
        game.discardEventCard(eventCard[0]);
      } else if (result === "f") {
        console.log("Player failed.");
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
      actionPhase = false;
      var avoidEffects = eventCard[0].actions.action2.a2Result;
      game.fortuneHardship(avoidEffects);
      game.discardEventCard(eventCard[0]);
    },

    /////////////////////////////////////////////////////////////////////////
    action3Result: function() {
    /////////////////////////////////////////////////////////////////////////
      if (inventory.length > 0 && eventCard[0].actions.action3.a3Result[0] === "Use item" && !canUseItem) {
        canUseItem = true;
        console.log("canUseItem set to true: " + canUseItem);
        console.log("Choose the item you want to use before you resolve this event.");
      } else {
        console.log("canUseItem set to false: " + canUseItem);
        console.log("You have no items to use.");
      }
    },

    /////////////////////////////////////////////////////////////////////////
    useAnItem: function(id) {
    /////////////////////////////////////////////////////////////////////////
      canUseItem = false;
      console.log("canUseItem set to false: " + canUseItem);
      // Search through inventory array to find the card object with the same (JSON) id.
      for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].id === id) {
          console.log("Item found in inventory: " + inventory[i]);
          var itemUsed = inventory[i];
          // Adjust fate modifier
          if (itemUsed.roomType) {
            if (eventCard[0].roomType === itemUsed.roomType) {
              console.log("Fate modifier set to: " + fateMod);
              fateMod = itemUsed.useItem.itemFate;
            } else {
              console.log("Sorry, you can only use this item in: " + itemUsed.roomType);
            }
          } else {
            console.log("Fate modifier set to: " + fateMod);
            fateMod = itemUsed.useItem.itemFate;
          }
          // Resolve item results
          if (itemUsed.useItem.itemResult) {
            game.fortuneHardship(itemUsed.useItem.itemResult);
          }
          console.log("Calling discardItemCard.");
          game.discardItemCard(1, itemUsed);
        } else {
          console.log("Can't find this card in the inventory.");
        }
      }
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
          game.drawItemCard(2);
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
          if (moonLevel + num >= 1) {
            moonLevel += num;
          } else {
            console.log("Moon level can't go lower");
          }
        }
    },

    /////////////////////////////////////////////////////////////////////////
    moonState: function(num) {
    /////////////////////////////////////////////////////////////////////////
      // TODO This function will be called at the end of every turn. Every 4 turns a certain amount of visited tiles get 'turned back over' at random.
      console.log("moonState function called.");
      console.log("Player turn over.");
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

    },

    /////////////////////////////////////////////////////////////////////////
    gameOver: function(num) {
    /////////////////////////////////////////////////////////////////////////
      console.log("You were never heard from again!");
      $(".map").addClass("visited");
      $(".map").removeClass("unvisited");
    }
  };

});
