$(document).ready(function() {
  Card.fetch().then(function(cards) {
    cards.forEach(function(card) {
      var view = new CardView(card);
      view.render();
    });
  });
  console.log("Hello! Script.js just ran!");
});
