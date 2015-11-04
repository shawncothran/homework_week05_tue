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

    $('.content').html('<object width="616" height="520"><param name="movie" value="http://www.pizn.com/swf/1-space-invaders.swf"><param name="quality" value="high"><embed src="http://www.pizn.com/swf/1-space-invaders.swf" quality="high" type="application/x-shockwave-flash"></embed></object>');
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
