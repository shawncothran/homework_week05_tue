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

    $('.content').html('<canvas id="screen" width="800" height="515">');
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
