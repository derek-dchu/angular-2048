'use strict';

var app = angular.module('2048App', ['Game', 'Grid']);

// Game Controller
app.controller('GameController', ['GameManager', 'GridManager', function(GameManager, GridManager) {
  this.game = GameManager;
  this.grid = GridManager;
}]);