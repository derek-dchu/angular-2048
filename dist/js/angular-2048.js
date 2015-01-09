'use strict';

var app = angular.module('2048App', ['Game', 'Grid', 'Keyboard', 'templates']);

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
'use strict';

angular.module('Grid', [])
.factory('TileModel', function() {
    var id = 16; // skip index

    var Tile = function(coordinate, val) {
        this.coordinate = coordinate;
        this.value = val || 2;
        this.merged = false;
        this.id = id++;
    };

    Tile.prototype.getPosition = function() {
        return this.coordinate;
    };

    Tile.prototype.updateCoordinate = function(newCoordinate) {
        this.coordinate = newCoordinate;
    };

    // Reset tile to initial state.
    Tile.prototype.reset = function() {
        this.merged = false;
    };

    return Tile;
})
.service('GridManager', ['TileModel', function(TileModel) {
        this.grid = [];
        this.tiles = [];
        // Size of the game board
        this.size = 4;
        // Initial Number of tiles
        this.initTileNumber = 2;

        var directions = {
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 },
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 }
        };

        // Helper function for create an new tile
        this.newTile = function(coordinate, val) {
            return new TileModel(coordinate, val);
        };

        // Generate empty game board with null for each cell
        this.generateEmptyGameBoard = function() {
            for (var i = 0; i < Math.pow(this.size, 2); i++) {
                this.grid[i] = null;
                this.tiles[i] = null;
            }
        };

        // Initialize game board (randomly insert initTileNumber of tiles
        this.initGameBoard = function() {
            for (var i = 0; i < this.initTileNumber; i++) {
                this.randomlyInsertTile();
            }
        };

        // Check if there are any matches available
        this.isTileMatchesAvailable = function() {
            for (var i = 0; i < Math.pow(this.size, 2); i++) {
                var coordinate = this._positionToCoordinate(i);
                var tile = this.tiles[i];

                if(tile) {
                    // Check all directions
                    for (var direction in directions) {
                        var direct = directions[direction];
                        var cell = { x: coordinate.x + direct.x, y: coordinate.y + direct.y };
                        if (this.isWithinGrid(cell) && this.getCellAt(cell).value == tile.value) {
                            return true;
                        }
                    }
                }
            }

            return false;
        };

        // Return ordered coordinates in direction
        this.coordinatesInDirection = function(key) {
            var direction = directions[key];
            var coordinates = {x: [], y: []};
            for (var i = 0; i < this.size; i++) {
                coordinates.x.push(i);
                coordinates.y.push(i);
            }
            // Going right
            if (direction.x > 0) {
                coordinates.x = coordinates.x.reverse();
            }
            // Going down
            if (direction.y > 0) {
                coordinates.y = coordinates.y.reverse();
            }
            return coordinates;
        };

        // Return the next possible coordinate for a tile to move
        this.nextAvailableCellInDirection = function(coordinate, key) {
            var direction = directions[key];
            var previous;

            do {
                previous = coordinate;
                coordinate = {
                    x: previous.x + direction.x,
                    y: previous.y + direction.y
                };
            } while (this.isCellAvailable(coordinate));

            return {
                nextCoordinate: previous,
                nextTile: this.getCellAt(coordinate)
            };
        };

        // Check to see there is a cell available at a given coordinate
        this.isCellAvailable = function(coordinate) {
            return this.isWithinGrid(coordinate) && !this.getCellAt(coordinate);
        };

        // Return coordinates of cells that don't contain a tile
        this.availableCells = function() {
            var cells = [];
            var self = this;
            this.forEachCell(function(coordinate) {
                if (self.isCellAvailable(coordinate)) {
                    cells.push(coordinate);
                }
            });

            return cells;
        };

        // Check to see there are still cells available
        this.isAnyCellAvailable = function() {
            return this.availableCells().length > 0;
        };

        // Return a random selected available cell
        this.randomAvailableCell = function() {
            var cells = this.availableCells();
            if (cells.length > 0) {
                return cells[Math.floor(Math.random() * cells.length)];
            }
        };

        // Apply callback function on each cell
        this.forEachCell = function(cb) {
            for (var i = 0; i < Math.pow(this.size, 2); i++) {
                var coordinate = this._positionToCoordinate(i);
                cb(coordinate, this.tiles[i]);
            }
        };

        // Set cell object by providing coordinate
        this.setCellAt = function(coordinate, tile) {
            var pos = this._coordinateToPosition(coordinate);
            this.tiles[pos] = tile;
        };

        // Get cell object by providing coordinate
        this.getCellAt = function(coordinate) {
            var pos = this._coordinateToPosition(coordinate);
            return this.tiles[pos];
        };

        // Prepare tiles for move
        this.prepareTiles = function() {
            this.forEachCell(function(coordinate, tile) {
                if (tile) {
                    tile.reset();
                }
            });
        };

        // Insert a tile to a cell
        this.insertTile = function(tile) {
            this.setCellAt(tile.coordinate, tile);
        };

        // Remove a current tile by delete it
        this.removeTile = function(tile) {
            var pos = this._coordinateToPosition(tile.coordinate);
            delete this.tiles[pos];
        };

        // Insert a new tile to a random available cell
        this.randomlyInsertTile = function() {
            var cell = this.randomAvailableCell();
            var tile = this.newTile(cell, 2);
            this.setCellAt(tile.coordinate, tile);
        };

        // Move a tile to new coordinate
        this.moveTile = function(tile, newCoordinate) {
            this.setCellAt(tile.coordinate, null);
            this.setCellAt(newCoordinate, tile);
            tile.updateCoordinate(newCoordinate);
        };

        // Convert position into actual coordinate
        this._positionToCoordinate = function(i) {
            if (i < 0 || i >= Math.pow(this.size, 2)) {
                return null;
            }
            return {x: Math.trunc(i / this.size), y: i % this.size};
        };

        // Convert coordinate into position
        this._coordinateToPosition = function(coordinate) {
            return coordinate.x * this.size + coordinate.y;
        };

        // Check whether a given coordinate is outside the grid
        this.isWithinGrid = function(coordinate) {
            return coordinate.x >= 0 && coordinate.x < this.size && coordinate.y >= 0 && coordinate.y < this.size;
        };

        // Check if two coordinates are the same
        this.areSameCoordinates = function(a, b) {
            return a.x === b.x ? a.y === b.y : false;
        };
    }]);
'use strict';

angular.module('Grid')
.directive('grid', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            templateUrl: 'gridId.html'
        };
    });
'use strict';

angular.module('Grid')
.directive('tile', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            templateUrl: 'tileId.html'
        };
    });
'use strict';

angular.module('Keyboard', [])

.service('KeyboardManager', ['$document', function($document) {

    var keyboardMap = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // Initialize the keyboard event binding
    this.init =function() {
        var self = this;
        this.keyEventHandlers = [];
        $document.bind('keydown', function(e) {
            var key = keyboardMap[e.which];

            if (key) {
                e.preventDefault();
                self._handleKeyEvent(key, e);
            }
        });
    };

    // Handle key event by calling callbacks
    this._handleKeyEvent = function(key, e) {
        var callbacks = this.keyEventHandlers;
        if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
                var cb = callbacks[i];
                cb(key ,e);
            }
        }
    };

    // Bind event handlers to get called when an event is fired
    this.on = function(cb) {
        this.keyEventHandlers.push(cb);
    };
}]);
