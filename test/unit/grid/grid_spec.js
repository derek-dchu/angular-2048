describe('Grid', function() {
    // Inject the Grid module into this test
    beforeEach(module('Grid'));

    var tile;
    describe('TileModel', function() {
        beforeEach(function() {
            tile = new tileModel({x:1, y: 1}, 2);
        });

        it('should save its own x coordinate', function() {
            expect(tile.coordinate.x).toEqual(1);
        });
        it('should save its own y coordinate', function() {
            expect(tile.coordinate.y).toEqual(1);
        });
        it('should save its own value', function() {
            expect(tile.value).toEqual(2);
        });
        it('should be able to retrieve its own coordinate', function() {
            expect(tile.getPosition()).toEqual({x:1, y:1});
        });
    });

    var gridManager;
    beforeEach(inject(function(GridManager) {
        gridManager = GridManager;
    }));

    it('should be injected', function() {
        expect(gridManager).toBeDefined();
    });

    var tileModel;
    beforeEach(inject(function(TileModel) {
        tileModel = TileModel;
    }));

    it('should be injected', function() {
        expect(tileModel).toBeDefined();
    });

    describe('GridManager', function() {
        describe('.generateEmptyGameBoard', function() {
            var nullArr;
            beforeEach(function() {
                nullArr = [];
                for (var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    nullArr.push(null);
                }
            });

            it('should clear out the grid array with nulls', function() {
                var grid = [];
                for (var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    grid.push(i);
               }
                gridManager.grid = grid;
                gridManager.generateEmptyGameBoard();
                expect(gridManager.grid).toEqual(nullArr);
            });

            it('should clear out the tiles array with nulls', function() {
                gridManager.generateEmptyGameBoard();
                expect(gridManager.tiles).toEqual(nullArr);
            });
        });

        describe('.availableCells', function() {
            it('should return coordinates of cells that don\'t contain a tile', function() {
                gridManager.generateEmptyGameBoard();
                var tile = new tileModel({x: 0, y: 0}, 2);
                for (var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    gridManager.tiles[i] = tile;
                }
                gridManager.tiles[1] = gridManager.tiles[2] = null;
                expect(gridManager.availableCells()).toEqual([{x: 0, y: 1}, {x: 0, y: 2}]);
            });
        });

        describe('.removeTile', function() {
            it('should remove a tile by setting it to null', function() {
                gridManager.generateEmptyGameBoard();
                var tile = new tileModel({x: 0, y: 0}, 2);
                for (var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    gridManager.tiles[i] = tile;
                }
                var cell = {x: 0, y: 0};
                gridManager.removeTile(gridManager.tiles[0]);
                expect(gridManager.getCellAt(cell)).toBeUndefined();
            });
        });

        describe('.tileMatchesAvailable', function() {
            it('should return true when there are matches available', function() {
                var tiles = [];
                for(var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    var tile = new tileModel(gridManager._positionToCoordinate(i), 2);
                    tiles.push(tile);
                }
                gridManager.tiles = tiles;
                expect(gridManager.isTileMatchesAvailable()).toBeTruthy();
            });

            it('should return false when none matches available', function() {
                var tiles = [];
                for(var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    var tile = new tileModel(gridManager._positionToCoordinate(i), i);
                    tiles.push(tile);
                }
                gridManager.tiles = tiles;
                expect(gridManager.isTileMatchesAvailable()).toBeFalsy();
            });
        });

        describe('.prepareTiles', function() {
            it('should prepare tiles for move by reset them', function() {
                var tiles = [];
                for(var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    var tile = new tileModel(gridManager._positionToCoordinate(i), i);
                    tiles.push(tile);
                }
                gridManager.tiles = tiles;
                gridManager.tiles[0].merged = true;
                gridManager.prepareTiles();
                expect(gridManager.tiles[0].merged).toBeFalsy();
            });
        });

        describe('.moveTile', function() {
            var tile;
            beforeEach(function() {
                var nullArr = [];
                for (var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    nullArr.push(null);
                }
                gridManager.tiles = nullArr;
                tile = gridManager.tiles[0] = new tileModel({x:0 , y: 0}, 2);
                gridManager.moveTile(tile, {x: 0, y: 1});
            });
            it('should move tile to a new coordinate', function() {

                expect(gridManager.tiles[1]).toEqual(tile);
            });
            it('should set original coordinate to null', function() {
                expect(gridManager.tiles[0]).toBeNull();
            });
            it('should update tile\'s coordinate', function() {
                expect(tile.coordinate).toEqual({x: 0, y: 1});
            });
        });
    });
});
