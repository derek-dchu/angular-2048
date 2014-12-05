'use strict';

angular.module('Game', ['Grid'])

.service('GameManager', ['GridService', function(GridService) {
    // initialize service
    this.reinit = function() {
        this.currentScore = 0;
        this.bestScore = 0;
    };
    this.reinit();

    // Create a new game
    this.newGame = function() {};
    // Handle user action
    this.move = function() {};
    // Update the score
    this.updateScore = function(newScore) {
        this.currentScore = newScore;
        if (this.currentScore > this.bestScore) {
            this.bestScore = this.currentScore;
        }
    };
    // Check is there any move left
    this.moveAvailable = function() {
        return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
    };
    // Get best score
    this.getBestScore = function() {
        return this.bestScore;
    };
}]);