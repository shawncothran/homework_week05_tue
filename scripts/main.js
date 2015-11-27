var GameRouter = Backbone.Router.extend({
  routes: {
    "": "menu",
    "play": "play",
    "leaderboard": "leaderboard",
    "settings": "settings",
  },

  menu: function(content) {
    setTimeout(function(){
      $('.content').html(_.template($('#gameTemplate').html()));
    }, 2000)
  },

  play: function(content) {

    $('.content').html('<canvas id="ctx" width="800" height="515">Your browser does not support the HTML5 <canvas> element. Please upgrade your browser.</canvas>');
    new Game("ctx");
  },

  leaderboard: function() {
    $('.content').html(_.template($('#leaderboardTemplate').html()));
  },

  settings: function() {
    $('.content').html(_.template($('#settingsTemplate').html()));
  }
});

var router = new GameRouter();

Backbone.history.start();
