'use strict';

var app = angular.module('2048App', ['Game', 'Grid', 'Keyboard']);

// Game Controller
app.controller('GameController', ['GameManager', 'GridManager', function(GameManager, GridManager) {
  this.game = GameManager;
  this.grid = GridManager;

  this.newGame = function() {
    this.game.newGame();
  };

  this.newGame();

  // Start game by binding key event to the game
  this.startGame = function() {
    var self = this;
    KeyboardManager.on(function(key) {
      self.game.move(key);
    });
  };

  this.startGame();
}]);