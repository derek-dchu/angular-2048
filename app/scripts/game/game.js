'use strict';

angular.module('Game', [])
.service('GameManager', ['GridService', function(GridService) {
        // Create a new game
        this.newGame = function() {};
        // Handle user action
        this.move = function() {};
        // Update the score
        this.updateScore = function() {};
        // Check is there any move left
        this.moveAvailable = function() {
                return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
        };
    }]);