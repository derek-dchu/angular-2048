describe('Grid', function() {
    // Inject the Grid module into this test
    beforeEach(module('Grid'));

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

        describe('.tileMatchesAvailable', function() {
            it('should return true when there are matches available', function() {
                var tiles = [];
                for(var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    var tile = new tileModel(gridManager._positionToCoordinate(i), 2);
                    tiles.push(tile);
                }
                gridManager.tiles = tiles;
                expect(gridManager.tileMatchesAvailable()).toBeTruthy();
            });

            it('should return false when none matches available', function() {
                var tiles = [];
                for(var i = 0; i < Math.pow(gridManager.size, 2); i++) {
                    var tile = new tileModel(gridManager._positionToCoordinate(i), i);
                    tiles.push(tile);
                }
                gridManager.tiles = tiles;
                expect(gridManager.tileMatchesAvailable()).toBeFalsy();
            });
        });
    });

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
});
