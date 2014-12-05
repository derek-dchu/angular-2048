describe('Game module', function() {
    describe('GameManager', function() {
        // Inject the Game module into this test
        beforeEach(module('Game'));

        var provide;

        var _gridService;
        beforeEach(module(function($provide) {
            // Create mocked gridService for this test
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

        describe('.reinit', function() {
            beforeEach(function() {
                gameManager.reinit();
            });

            it('should initialize current score to 0', function() {
                   expect(gameManager.currentScore).toEqual(0);
            });
            it('should initialize best score to 0', function() {
                    expect(gameManager.bestScore).toEqual(0);
            });
        });

        describe('.updateScore', function() {
            it('should update current score', function() {
                gameManager.updateScore(1);
                expect(gameManager.currentScore).toEqual(1);
            });

            it('should update best score when new score is higher than best score', function() {
                gameManager.bestScore = 10;
                gameManager.updateScore(50);
                expect(gameManager.getBestScore()).toEqual(50);
            });
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