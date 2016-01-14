# Moonlight Mansion
This is an early proof of concept for a board game I'm designing inspired by the 'weird fiction' of H.P. Lovecraft and Clark Ashton Smith.

# Rules:
## Goal: Have the 'Ancient Relic' item card in your inventory when the moon level reached 25.

## Game over: The game ends when sanity reaches 0 or the moon level reached 25 and you aren't holding the 'Ancient Relic' item card.

## Player Turn:
1. Click a map tile that's adjacent to one you've previously visited to draw that tile's Event Card.
2. Choose one of three actions.
  - The first action always starts the game of chance called "Meet Your Fate". The risks are higher but there's a reward if you win. This is the primary way for you to draw a card from the item deck.
  - The second action is the equivalent of a "Flee" option. The effects listed next to the action are resolved. They typically penalize the player, although to a lesser extent than action 1.
  - When present, the third action allows you to use an item from your inventory before resolving the current Event Card. Once you use an item you can then choose the current Event Card's first or second action.
3. Event Card effects resolved based on player's chosen action and the card is discarded.
4. Moon level increases by 1.

# Screenshot of Moonlight Mansion
[Screenshot](http://imgur.com/5mhX2Wf)

# Technologies used
This app uses NodeJS, ExpressJS, MongoDB, Mongoose, and Handlebars. To install dependencies type:
```
npm install --save hbs express mongoose
```

# Wireframe
[Wireframe](https://drive.google.com/file/d/0B1R1j4cojTrNbUQ4b2JLVEtlNlU/view?usp=sharing)

# Issues
While almost all of the major game mechanics are in and working, the gameplay balance, design of the core gameplay loop, user experience, available cards, and the overall visual direction still have a way to go.

The game is not in a enjoyable state and as is should only be seen as a proof of concept. I expect this to change in the next couple weeks as I'd like this finished at the end of the month.
