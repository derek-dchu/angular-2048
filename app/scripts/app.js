'use strict';

var app = angular.module('2048App', ['Game', 'Grid', 'Keyboard']);

// Save templates
app.run(function($templateCache) {
  $templateCache.put('mainId.html',
    '<div id="content" ng-controller="GameController as gctrl">' +
    '<div class="row">' +
    '<div id="game-board" class="col-md-9">' +
    '<div grid ng-model="gctrl.gameManager"></div> ' +
    '</div>' +
    '<div id="user-board" class="col-md-3">' +
    '<div class="score">' +
    '<p>Current Score: {{ gctrl.gameManager.currentScore }}</p>' +
    '</div>' +
    '<div class="best-score">' +
    '<p>Best Score: {{ gctrl.gameManager.bestScore }}</p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  );

  $templateCache.put('gridId.html',
    '<div class="grid-container">' +
    '<div class="grid-cell"' +
    'ng-repeat="cell in ngModel.grid track by $index"></div>' +
    '</div>' +
    '<div class="tile-container">' +
    '<div tile ng-model="tile" ng-repeat="tile in ngModel.tiles track by $id(tile.id || $index)"></div>' +
    '</div>'
  );

  $templateCache.put('tileId.html',
    '<div ng-if="ngModel" class="tile tile-{{ ngModel.value }} position-{{ ngModel.coordinate.x }}-{{ ngModel.coordinate.y }}">' +
    '<div class="tile-inner">' +
    '{{ ngModel.value }}' +
    '</div>' +
    '</div>'
  );
});



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