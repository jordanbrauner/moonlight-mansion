# Moonlight Mansion
**Version: 0.0.1**
This is the digital version of a board game I'm designing that's inspired by the weird fiction of H.P. Lovecraft and Clark Ashton Smith. Perhaps best summed up as a card-based rogue-like.

# About
Moonlight Mansion began life on January 8th, 2016 as my final project for General Assembly's Web Development Immersive. Turns out that I'm rather fond of this little game I created and will be expanding and polishing it over the coming months.

# State of the game
Please note that the game is currently in an alpha state. There are numerous planned features that will be implemented over the coming months. As such, the game is not yet properly balanced and the visuals and interface are all placeholders. If you don't like experiencing bugs or getting frustrated with an unbalanced game then I'd suggest waiting until the game is released.

# Rules:
**Goal:**
Have the 'Ancient Relic' item card in your inventory when the moon level reached 25.

**Game Over:**
The game ends when sanity reaches 0 or the moon level reached 25 and you aren't holding the 'Ancient Relic' item card.

## Player Turn:
1. Click a map tile that's adjacent to one you've previously visited to draw that tile's Event Card.
2. Choose one of three actions.
  - The first action always starts the game of chance called "Meet Your Fate". The risks are higher but there's a reward if you win. This is the primary way for you to draw a card from the item deck.
  - The second action is the equivalent of a "Flee" option. The effects listed next to the action are resolved. They typically penalize the player, although to a lesser extent than action 1.
  - When present, the third action allows you to use an item from your inventory before resolving the current Event Card. Once you use an item you can then choose the current Event Card's first or second action.
3. Event Card effects resolved based on player's chosen action and the card is discarded.
4. Moon level increases by 1.

## Card Effects
The room and item card effects are currently using placeholder text. Here's how to make sense of them. Each effect has a name followed by a "U" or "D" and a number. The "U" (up) and "D" (down) detail whether you will gain or lose the amount of the number that follows it. Example: "sanityU3" means that you 3 sanity will be added to your sanity level while "sanityD1" means you will lose 1 from your sanity level.

1. sanity
Sanity is essentially your life. If it hits zero you lose the game.

2. moon
The moon level is a time limit that increases at the end of every player turn. You can slow or speed up depending on the result of the effect resolved. Example: "moonD3" lowers the moon level by 3.

3. item
The item effect tells you to draw or discard a certain amount of cards from your hand (the inventory). Example: You would draw one card with "itemU1".

4. relic
"relicU" means you draw the "Ancient Relic" card. This is what you need in your hand when the time limit is up to witn the game. "relicD" forces you to discard the card from your hand.

*Not yet implemented*
1. oldKey
Once implemented, this card will be essential to succeeding in one particular room card that rewards you with the "Ancient Relic".

# Screenshot of Moonlight Mansion
[Screenshot](http://imgur.com/5mhX2Wf)

# Technologies used
This app uses Node.js, Express, MongoDB, Mongoose, and Handlebars. To install dependencies type:
```
npm install --save hbs express mongoose
```

# Wireframe
[Wireframe](https://drive.google.com/file/d/0B1R1j4cojTrNbUQ4b2JLVEtlNlU/view?usp=sharing)

# Issues
While almost all of the major game mechanics are in and working, the gameplay balance, design of the core gameplay loop, user experience, available cards, and the overall visual direction still have a way to go.

The game is not in a enjoyable state and as is should only be seen as a proof of concept. I expect this to change in the next couple weeks as I'd like this finished at the end of the month.
