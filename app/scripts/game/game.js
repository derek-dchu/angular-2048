'use strict';

angular.module('Game', ['Grid'])

.service('GameManager', ['GridManager', function(GridManager) {
    // initialize service
    this.reinit = function() {
        this.currentScore = 0;
        this.bestScore = 0;
        this.win = false;
        this.gameOver =false;
    };

    // Create a new game
    this.newGame = function() {
        GridManager.generateEmptyGameBoard();
        GridManager.initGameBoard();
        this.reinit();
    };

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
        return GridManager.anyCellsAvailable() || GridManager.tileMatchesAvailable();
    };

    // Get best score
    this.getBestScore = function() {
        return this.bestScore;
    };
}]);