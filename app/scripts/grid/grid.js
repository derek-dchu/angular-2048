'use strict';

angular.module('Grid', [])
.service('GridManager', function() {
        this.grid = [];
        this.tiles = [];
        // Size of the game board
        this.size = 4;

        var directions = {
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 },
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 }
        };

        // Generate empty game board with null for each cell
        this.generateEmptyGameBoard = function() {
            for (var i = 0; i < Math.pow(this.size, 2); i++) {
                this.grid[i] = null;
            }
            this.initTiles();
        };

        // Apply callback function on each cell
        this.forEachCell = function(cb) {
            for (var i in this.tiles) {
                var coordinate = this._positionToCoordinate(i);
                cb(coordinate.x, coordinate.y, this.tiles[i]);
            }
        };

        // Initialize tiles with null value
        this.initTiles = function() {
            this.forEachCell(function(x, y) {
                self.setCellAt({x: x, y: y}, null);
            })
        };

        // Set cell object by providing coordinate
        this.setCellAt = function(coordinate, tile) {
            if (this.isWithinGrid(coordinate)) {
                var pos = this._coordinateToPosition(coordinate);
                this.tiles[pos] = tile;
            }
        };

        // Get cell object by providing coordinate
        this.getCellAt = function(coordinate) {
            if (this.isWithinGrid(coordinate)) {
                var pos = this._coordinateToPosition(coordinate);
                return this.tiles[pos];
            }
            return null;
        };

        // Check if there are any matches available
        this.tileMatchesAvailable = function() {
            for (var i = 0; i < Math.pow(this.size, 2); i++) {
                var coordinate = this._positionToCoordinate(i);
                var tile = this.tiles[i];

                if(tile) {
                    // Check all directions
                    for (var direction in directions) {
                        var direct = directions[direction];
                        var cell = { x: coordinate.x + direct.x, y: coordinate.y + direct.y };
                        var surroundings = this.getCellAt(cell);
                        if (surroundings && surroundings.value == tile.value) {
                            return true;
                        }
                    }
                }
            }

            return false;
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
            if (this.isWithinGrid(coordinate)) {
                return coordinate.x * this.size + coordinate.y;
            }
            return null;
        };

        // Check whether a given coordinate is outside the grid
        this.isWithinGrid = function(coordinate) {
            return coordinate.x >= 0 && coordinate.x < this.size && coordinate.y >= 0 && coordinate.y < this.size
        };
    })

.factory('TileModel', function() {
        var Tile = function(coordinate, val) {
            this.x = coordinate.x;
            this.y = coordinate.y;
            this.value = val || 2;
        };

        Tile.prototype.getPosition = function() {
            return {x:this.x, y:this.y};
        };

        return Tile;
    });