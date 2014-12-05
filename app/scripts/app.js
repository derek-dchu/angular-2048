'use strict';

var app = angular.module('2048App', ['Game', 'Grid']);

// Game Controller
app.controller('GameController', ['GameManager', function(GameManager) {
  this.game = GameManager;
}]);