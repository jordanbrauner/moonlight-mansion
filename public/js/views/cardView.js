var CardView = function(card) {
  this.card = card;
  console.log("CardView called for " + card);
  this.$el = $("<div class='card'></div>");
  this.render();
  $(".all-cards").append(this.$el);
};

CardView.prototype = {
  render: function() {
    var self = this;
    self.$el.html(self.cardTemplate(self.card));
  },
  cardTemplate: function() {
    // puts all the information in one card into a div
    var card = this.card;
    var html = $("<div>");
    html.append("<p>" + card.cardName + "</p>");
    return (html);
  },
  eventView: function() {
    var card = this.card;
    var html = $("<div>");
  }
};
