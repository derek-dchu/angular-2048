describe('Grid', function() {
    // Inject the Grid module into this test
    beforeEach(module('Grid'));

    var tileModel;
    beforeEach(inject(function(TileModel) {
        tileModel = TileModel;
    }));

    it('should be injected', function() {
        expect(tileModel).toBeDefined();
    });

    var tile;
    describe('TileModel', function() {
        beforeEach(function() {
            tile = new tileModel({x:1, y: 1}, 2);
        });

        it('should save its own x coordinate', function() {
            expect(tile.x).toEqual(1);
        });
        it('should save its own y coordinate', function() {
            expect(tile.y).toEqual(1);
        });
        it('should save its own value', function() {
            expect(tile.value).toEqual(2);
        });
        it('should be able to retrieve its own coordinate', function() {
            expect(tile.getPosition()).toEqual({x:1, y:1});
        });
    });
});
