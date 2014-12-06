'use strict';

angular.module('Grid', [])
.service('GridManager', function() {
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

        // Generate empty game board with null for each cell
        this.generateEmptyGameBoard = function() {
            for (var i = 0; i < Math.pow(this.size, 2); i++) {
                this.grid[i] = null;
                this.tiles[i] = null;
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

        // Return coordinates of cells that don't contain a tile
        this.availableCells = function() {
            var cells = [],
                self = this;

            this.forEachCell(function(coordinate) {
                var tile = self.getCellAt(coordinate);
                if (!tile) {
                    cells.push(coordinate);
                }
            });

            return cells;
        };

        // Return a random selected available cell
        this.randomAvailableCells = function() {
            var cells = this.availableCells();
            if (cells.length > 1) {
                return cells[Math.floor(Math.random() * cells.length)];
            }
        };

        // Insert new tile to a random available cell
        this.insertTile = function() {
            var cell = this.availableCells(),
                tile = new TileModel(cell, 2);
            this.setCellAt(cell, tile);
        };

        // Remove a current tile by setting it to null
        this.removeTile = function(coordinate) {
            this.setCellAt(coordinate, null);
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
            this.coordinate = coordinate;
            this.value = val || 2;
        };

        Tile.prototype.getPosition = function() {
            return this.coordinate;
        };

        return Tile;
    });