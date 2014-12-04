describe('Game module', function() {
    describe('GameManager', function() {
        // Inject the Game module into this test
        beforeEach(module('Game'));

        var provide;

        // Create mocked gridService for this test
        var _gridService;
        beforeEach(module(function($provide) {
            _gridService = {
                anyCellsAvailable: angular.noop,
                tileMatchesAvailable: angular.noop
            };

            // Replace real GridService with mocked one
            $provide.value('GridService', _gridService);
            provide = $provide;
        }));

        var gameManager; // Instance of the GameManager
        beforeEach(inject(function(GameManager) {
            gameManager = GameManager;
        }));

        it('should have a GameManage', function() {
            expect(gameManager).toBeDefined();
        });

        describe('.movesAvailable', function() {
            it('should report true if there are cells available', function() {
                spyOn(_gridService, 'anyCellsAvailable').andReturn(true);
                expect(gameManager.moveAvailable()).toBeTruthy();
            });

            it('should report true if there are matched available', function() {
                spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
                spyOn(_gridService, 'tileMatchesAvailable').andReturn(true);
                expect(gameManager.moveAvailable()).toBeTruthy();
            });

            it('should report false if there are no cells nor matched available', function() {
                spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
                spyOn(_gridService, 'tileMatchesAvailable').andReturn(false);
                expect(gameManager.moveAvailable()).toBeFalsy();
            });
        });
    });
});