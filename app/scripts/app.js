'use strict';

var app = angular.module('2048App', ['Game', 'Grid', 'Keyboard']);

// Game Controller
app.controller('GameController', ['GameManager', 'KeyboardManager', function(GameManager, KeyboardManager) {
  this.gameManager = GameManager;

  this.newGame = function() {
    KeyboardManager.init();
    this.gameManager.newGame();
    this.startGame();
  };

  // Start game by binding key event to the game
  this.startGame = function() {
    var self = this;
    KeyboardManager.on(function(key) {
      self.gameManager.move(key);
    });
  };

  this.newGame();
}]);