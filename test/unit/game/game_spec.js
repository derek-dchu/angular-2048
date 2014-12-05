describe('Game module', function() {
    describe('GameManager', function() {
        // Inject the Game module into this test
        beforeEach(module('Game'));

        var provide;

        var _gridManager;
        beforeEach(module(function($provide) {
            // Create mocked gridService for this test
            _gridManager = {
                anyCellsAvailable: angular.noop,
                tileMatchesAvailable: angular.noop,
                generateEmptyGameBoard: angular.noop,
                initGameBoard: angular.noop
            };

            // Replace real GridManager with mocked one
            $provide.value('GridManager', _gridManager);

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

        describe('.newGame', function() {
            it('should call the GridManager to generate an empty game board', function() {
               spyOn(_gridManager, 'generateEmptyGameBoard').andCallThrough();
               gameManager.newGame();
               expect(_gridManager.generateEmptyGameBoard).toHaveBeenCalled();
           });
            it('should call the GridManager to place initial pieces', function() {
                spyOn(_gridManager, 'initGameBoard').andCallThrough();
                gameManager.newGame();
                expect(_gridManager.initGameBoard).toHaveBeenCalled();
            });
            it('should call reinit at the end', function() {
                spyOn(gameManager, 'reinit').andCallThrough();
                gameManager.newGame();
                expect(gameManager.reinit).toHaveBeenCalled();
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
                spyOn(_gridManager, 'anyCellsAvailable').andReturn(true);
                expect(gameManager.moveAvailable()).toBeTruthy();
            });

            it('should report true if there are matched available', function() {
                spyOn(_gridManager, 'anyCellsAvailable').andReturn(false);
                spyOn(_gridManager, 'tileMatchesAvailable').andReturn(true);
                expect(gameManager.moveAvailable()).toBeTruthy();
            });

            it('should report false if there are no cells nor matched available', function() {
                spyOn(_gridManager, 'anyCellsAvailable').andReturn(false);
                spyOn(_gridManager, 'tileMatchesAvailable').andReturn(false);
                expect(gameManager.moveAvailable()).toBeFalsy();
            });
        });
    });
});