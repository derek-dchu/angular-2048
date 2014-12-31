'use strict';

angular.module('Game', ['Grid', 'ngCookies'])

.service('GameManager', ['$q', 'GridManager', '$cookieStore', function($q, GridManager, $cookieStore) {

    this.grid = GridManager.grid;
    this.tiles = GridManager.tiles;
    this.winningValue = 2048;

    // initialize service
    this.reinit = function() {
        this.currentScore = 0;
        this.bestScore = this.getBestScore();
        this.win = false;
        this.gameOver = false;
    };

    // Create a new game
    this.newGame = function() {
        GridManager.generateEmptyGameBoard();
        GridManager.initGameBoard();
        this.reinit();
    };

    // Handle user action
    this.move = function(key) {
        var self = this;
        var loop = function() {
            // If the game is over, user can't move
            if (self.gameOver) { return false; }
            var coordinates = GridManager.coordinatesInDirection(key);
            var isValidMove = false;

            // Update Grid
            GridManager.prepareTiles();

            coordinates.x.forEach(function(x) {
                coordinates.y.forEach(function(y) {
                    // For each cell
                    var originalCoordinate = {x: x, y: y};
                    var tile = GridManager.getCellAt(originalCoordinate);

                    if (tile) {
                        var cell = GridManager.nextAvailableCellInDirection(tile.coordinate, key),
                            nextTile = cell.nextTile;

                        // Find the next tile can be merged
                        if(nextTile && nextTile.value === tile.value && !nextTile.merged) {
                            // Perform merge
                            var newValue = tile.value * 2;
                            var mergedTile = GridManager.newTile(tile.coordinate, newValue);
                            mergedTile.merged = true;

                            // Remove current tile
                            GridManager.removeTile(tile);
                            // Insert new tile on top of current tile
                            GridManager.insertTile(mergedTile);
                            // Move merged tile and remove destination tile
                            GridManager.moveTile(mergedTile, nextTile.coordinate);

                            self.updateScore(self.currentScore + newValue);
                            if (newValue >= self.winningValue) {
                                this.win = true;
                            }
                            isValidMove = true;
                        } else if (!GridManager.areSameCoordinates(originalCoordinate, cell.nextCoordinate)) {
                            // Cant merge but there is available cell
                            GridManager.moveTile(tile, cell.nextCoordinate);
                            isValidMove = true;
                        }
                    }
                });
            });

            if (isValidMove) {
                // Insert new tiles for next round
                GridManager.randomlyInsertTile();

                // If user won the game or there is no available move, game over
                if (self.win || !self.moveAvailable()) {
                    self.gameOver = true;
                }
            }
        };
        return $q.when(loop());
    };

    // Update the score
    this.updateScore = function(newScore) {
        this.currentScore = newScore;
        if (this.currentScore > this.bestScore) {
            this.bestScore = this.currentScore;
            $cookieStore.put('bestScore', this.currentScore);
        }
    };

    // Check is there any move left
    this.moveAvailable = function() {
        return GridManager.isAnyCellAvailable() || GridManager.isTileMatchesAvailable();
    };

    // Get best score
    this.getBestScore = function() {
        return parseInt($cookieStore.get('bestScore')) || 0;
    };
}]);