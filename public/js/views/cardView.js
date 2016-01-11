var CardView = function(card) {
  this.card = card;

  this.$el = $("<div class='card'></div>");
  this.render();

  $(".cards").append(this.$el);
}

CardView.prototype = {
  render: function() {
    var self = this;

    self.$el.html(self.cardTemplate(self.card));
  },
  cardTemplate: function() {
    var card = this.card;
    var html = $("<div>");
    html.append("<h1>" + card.roomType + "</h1>");
    html.append("<h2>" + card.cardName + "</h2>");
    html.append("<p>" + card.flavorText + "</p>");
    return(html);
  }
};
