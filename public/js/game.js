$(document).ready(function() {

  // Set Variables
  eventDeck = [];
  itemDeck = [];
  eventCard = [];
  inventory = [];
  discarded = [];
  sanityLevel = 10;
  moonLevel = 1;
  moonCheckCounter = 1;
  fateMod = 0;
  canUseItem = false;
  actionPhase = false;
  turnCounter = 1;

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
      $("#card-wrapper #room-type").html("Enter a room");

      game.renderUI();
      console.log("Game started");

      // NOTE CODE BELOW FOR TESTING PURPOSE ONLY
      $("#renderUI").on("click", function() {
        game.renderUI();
      });

    },

    /////////////////////////////////////////////////////////////////////////
    shuffleDeck: function(toShuffle, discarded) {
    /////////////////////////////////////////////////////////////////////////
      console.log("Shuffling " + toShuffle[0].cardType + " deck!");
      // $(".all-cards").html("");
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
        $("#message-log").html("");
        $("#message-log").append("<p>Start of turn " + turnCounter + ".</p>");
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
      $(".card-element-container").show();
      $("#actions-wrapper").show();
      if (eventDeck.length > 0 && eventCard.length < 1) {
        eventCard.push(eventDeck.splice(tileNumber, 1, "drawn")[0]);
        var drawnCard = eventCard[0];
        actionPhase = true;

        // Render card information into their HTML elements
        $("#card-wrapper #room-type").html(drawnCard.roomType);
        $("#card-wrapper .card-name").html(drawnCard.cardName);
        $("#card-wrapper .flavor-text").html(drawnCard.flavorText);
        $("#action-1-fate").html("<strong>Room difficulty</strong>: " + -(drawnCard.actions.action1.actionFate) + "</p>");

        // Action 1
        $("#a1-name").html(drawnCard.actions.action1.a1Name);
        $("#a1-fortune").html("<strong>Fortune: </strong>" + drawnCard.actions.action1.fortune);
        $("#a1-hardship").html("<strong>Hardship: </strong>" + drawnCard.actions.action1.hardship);

        $("#action-1").on("click", function() {
          console.log("Action 1 clicked");
          if (actionPhase) {
            game.meetYourFate();
          }
          game.listenersOff();
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
          game.listenersOff();
        });

        // Action 3
        $("#a3-name").html(drawnCard.actions.action3.a3Name);
        $("#a3-result").html(drawnCard.actions.action3.a3Result);

        $("#action-3").on("click", function() {
          console.log("Action 3 clicked");
          if (actionPhase) {
            game.action3Result();
          }
          $("action-3").off("click");
        });
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
      $("#action-1-fate").html("");

      $("#a1-name").html("");
      $("#a1-fortune").html("");
      $("#a1-hardship").html("");

      $("#a2-name").html("");
      $("#a2-result").html("");

      $("#a3-name").html("");
      $("#a3-result").html("");

      game.moonMethods.moonState();
    },

    /////////////////////////////////////////////////////////////////////////
    drawItemCard: function(num) {
    /////////////////////////////////////////////////////////////////////////
      if (itemDeck.length > 0 && inventory.length + num <= 4) {
        while (num) {
          console.log("Number of cards in the inventory: " + inventory.length);
          console.log("Drawing item card: " + itemDeck[0].cardName);
          $("#message-log").append("<p>You drew the: " + itemDeck[0].cardName + " card.</p>");
          inventory.push(itemDeck.splice(0, 1)[0]);
          console.log("Card placed in the inventory: " + inventory[inventory.length-1].cardName);
          var newItem = inventory[inventory.length-1];
          $("#inventory-wrapper").append(
            "<div class='card-element-container select player-item' id='item-" + newItem.id + "'>" +
              "<div class='left-column'>" +
                "<h2>" + newItem.cardName + "</h2>" +
                "<p>" + newItem.flavorText + "</p>" +
              "</div>" +
              "<div class='right-column'></div>" +
            "</div>");

          var itemFate = newItem.useItem.itemFate;
          var itemResult = newItem.useItem.itemResult;
          var roomType = newItem.roomType;

          if (itemFate && roomType) {
            $("#item-" + newItem.id + " .right-column").append("<p>Increases fate in <strong>" + roomType + "</strong>: " + itemFate + "</p>");
          } else if (itemFate && !roomType) {
            $("#item-" + newItem.id + " .right-column").append("<p>Increases fate: " + itemFate + "</p>");
          }

          if (itemResult) {
            $("#item-" + newItem.id + " .right-column").append("<p><strong>Modifies</strong>: " + itemResult + "</p>");
          }
          num -= 1;

          $("#item-" + newItem.id).on("click", function() {
            game.useAnItem(newItem.id);
            $(this).off("click");
          });

          // Debug footer
          // $("#inventory-temp").append("<div><p>" + newItem.cardName + "</p></div>");
          // game.renderUI();
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
      console.log("Placeholder for discardItemCard function.");
      // while (numToDiscard) {
      //   console.log("Item card to discard: " + card.cardName);
      //   numToDiscard -= 1;
      // }
    },

    /////////////////////////////////////////////////////////////////////////
    meetYourFate: function() {
    /////////////////////////////////////////////////////////////////////////
    $(".card-element-container").hide();
    $("#actions-wrapper").hide();
    $("#meet-your-fate-container").show();
      // instantiate variable for the card's fate
      var fate = eventCard[0].actions.action1.actionFate + fateMod;
      console.log("Fate now set at: " + fate);
      var fortuneCardsAmount = 0;
      fateDeck = [];

      // Determine the number of fortune and hardship cards used in meetYourFate
      if (fate >= 3) {
        fortuneCardsAmount = 7;
      } else if (fate === 2) {
        fortuneCardsAmount = 6;
      } else if (fate === 1) {
        fortuneCardsAmount = 5;
      } else if (fate === 0) {
        fortuneCardsAmount = 4;
      } else if (fate === -1) {
        fortuneCardsAmount = 3;
      } else if (fate === -2) {
        fortuneCardsAmount = 2;
      } else if (fate <= -3) {
        fortuneCardsAmount = 1;
      }

      var fortuneCardsAmountTemp = fortuneCardsAmount;

      // Create fate deck
      while (fortuneCardsAmount > 0) {
        fateDeck.push("fortune");
        fortuneCardsAmount -= 1;
      }
      while (fateDeck.length < 8) {
        fateDeck.push("hardship");
      }

      // Shuffle fate deck
      for (var i = fateDeck.length - 1; i > 0; i--) {
        var rnd = Math.floor(Math.random() * (i + 1));
        var temp = fateDeck[i];
        fateDeck[i] = fateDeck[rnd];
        fateDeck[rnd] = temp;
      }

      console.log("This is the shuffled fateDeck: " + fateDeck);

      // Clear div
      $("#card-wrapper #room-type").html("Meet Your Fate...");
      $("#card-wrapper .card-name").html("");
      $("#card-wrapper .flavor-text").html("");
      $("#action-1-fate").html("<strong>Number of Fortune cards in play</strong>: " +  fortuneCardsAmountTemp + "</p>");

      $("#a1-name").html("");
      $("#a1-fortune").html("");
      $("#a1-hardship").html("");

      $("#a2-name").html("");
      $("#a2-result").html("");

      $("#a3-name").html("");
      $("#a3-result").html("");

      // Render cards in div
      for (var j = 1; j < 9; j++) {
        $("#meet-your-fate-container").append("<div id='" + fateDeck[j] + "'></div>");
      }

      $("#meet-your-fate-container").on("click", function(event) {
        var gameResult = $(event.target).attr("id");
        if (gameResult === "fortune") {
          $("#message-log").append("<p><strong>Fortune favored you</strong>.</p>");
          game.action1Result("s");
        } else if (gameResult === "hardship") {
          $("#message-log").append("<p><strong>Fortune abandoned you</strong>.</p>");
          game.action1Result("f");
        } else {
          console.log("There's been an error with the game's result.");
        }
        $("#meet-your-fate-container").html("");
        $("#meet-your-fate-container").off("click");
        $("#meet-your-fate-container").hide();
      });

    },

    /////////////////////////////////////////////////////////////////////////
    action1Result: function(result) {
    /////////////////////////////////////////////////////////////////////////
      actionPhase = false;
      if (result === "s") {
        console.log("Player succeeded.");
        var fortuneEffects = eventCard[0].actions.action1.fortune;
        game.fortuneHardship(fortuneEffects);
        console.log("Calling discardEventCard with the following card: " + eventCard[0].cardName);
        game.discardEventCard(eventCard[0]);
      } else if (result === "f") {
        console.log("Player failed.");
        var hardshipEffects = eventCard[0].actions.action1.hardship;
        game.fortuneHardship(hardshipEffects);
        console.log("Calling discardEventCard with the following card: " + eventCard[0].cardName);
        game.discardEventCard(eventCard[0]);
      } else {
        console.log("(action1result) Error: The result was neither a success or failure.");
      }
    },

    /////////////////////////////////////////////////////////////////////////
    action2Result: function() {
    /////////////////////////////////////////////////////////////////////////
      $("#message-log").append("<p><strong>You decided to move on</strong>.</p>");
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
        $("#message-log").append("<p>Choose the item you want to use before you resolve this event.</p>");
        console.log("Choose the item you want to use before you resolve this event.");
      } else {
        console.log("canUseItem set to false: " + canUseItem);
        $("#message-log").append("<p>You have no items to use.</p>");
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
              $("#message-log").append("<p>Sorry, you can only use this item in: " + itemUsed.roomType + "</p>");
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

      console.log("Resolving the following effects: " + effects);
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
          game.moonMethods.moonCheck(1);
        } else if (effects[e] === "moonU2") {
          game.moonMethods.moonCheck(2);
        } else if (effects[e] === "moonU3") {
          game.moonMethods.moonCheck(3);
        } else if (effects[e] === "moonU4") {
          game.moonMethods.moonCheck(4);
        } else if (effects[e] === "moonD1") {
          game.moonMethods.moonCheck(-1);
        } else if (effects[e] === "moonD2") {
          game.moonMethods.moonCheck(-2);
        } else if (effects[e] === "moonD3") {
          game.moonMethods.moonCheck(-3);
        } else if (effects[e] === "moonD4") {
          game.moonMethods.moonCheck(-4);
        } else {
          console.log("Effect not found: " + effects[e]);
        }
        game.renderUI();
      }
    },

    /////////////////////////////////////////////////////////////////////////
    sanityCheck: function(num) {
    /////////////////////////////////////////////////////////////////////////
    console.log("Adjusting the sanity level by " + num);
    $("#message-log").append("<p>Sanity adjusted by " + num + ".</p>");
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
    moonMethods: {
    /////////////////////////////////////////////////////////////////////////
      moonCheck: function(num) {
        console.log("Adjusting the moon level by " + num);
        $("#message-log").append("<p>Moon height adjusted by " + num + ".</p>");
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

      moonState: function(num) {
        // TODO This function will be called at the end of every turn. Every 4 turns a certain amount of visited tiles get 'turned back over' at random.
        console.log("moonState function called.");
        console.log("Player turn over.");
        game.endTurn();
      }

    },

    /////////////////////////////////////////////////////////////////////////
    listenersOff: function() {
    /////////////////////////////////////////////////////////////////////////
      $("#action-1").off("click");
      $("#action-2").off("click");
      $("#action-3").off("click");
    },

    /////////////////////////////////////////////////////////////////////////
    endTurn: function(num) {
    /////////////////////////////////////////////////////////////////////////
      game.listenersOff();
      $("#message-log").append("<p>The moon rises.</p>");
      console.log("The moon rises.");
      moonLevel += 1;
      turnCounter += 1;
      $("#message-log").append("<p>End of turn " + (turnCounter - 1) + ".</p>");
      game.renderUI();
    },

    /////////////////////////////////////////////////////////////////////////
    renderUI: function() {
    /////////////////////////////////////////////////////////////////////////
      // Clear UI
      $("#event-deck").html("");
      $("#item-deck").html("");
      $("#discarded").html("");
      $("#inventory-temp").html("");
      $("#sanity-level").html("");
      $("#moon-level").html("");

      // Update UI
      $("#sanity-level").html(sanityLevel);
      $("#moon-level").html(moonLevel);
    },

    /////////////////////////////////////////////////////////////////////////
    gameOver: function(num) {
    /////////////////////////////////////////////////////////////////////////
      $("#message-log").append("<p>You were never heard from again.</p>");
      console.log("You were never heard from again!");
      $(".map").addClass("visited");
      $(".map").removeClass("unvisited");
    }
  };

});
