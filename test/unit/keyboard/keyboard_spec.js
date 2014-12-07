describe('Keyboard module', function() {


    describe('KeyboardManger', function() {
        // Inject the Keyboard module for this test
        beforeEach(module('Keyboard'));

        var keyboardManager;
        beforeEach(inject(function(KeyboardManager) {
            keyboardManager = KeyboardManager;
        }));

        it('should be injected', function() {
            expect(keyboardManager).toBeDefined();
        });

        describe('.on', function() {
            it('should add new callback function into keyEventHandlers', function() {
                var callback = function(key, e) {
                    console.log(key);
                };
                keyboardManager.on(callback);
                expect(keyboardManager.keyEventHandlers).toEqual([callback]);
            });
        });

        describe('._handleKeyEvent', function() {
            it('should call all callback functions for a key event', function() {
                var keyTriggered = 0;
                var callback = function(key, e) {
                    keyTriggered = key;
                };
                keyboardManager.keyEventHandlers = [callback];
                keyboardManager._handleKeyEvent('left');
                expect(keyTriggered).toEqual('left');
            });
        });

        describe('.init', function() {
            it('should initialize $document to be binded with \'keydown\' event', function() {
                keyboardManager.init();
                var keyTriggered = 0;
                var callback = function(key, e) {
                    keyTriggered = key;
                };
                keyboardManager.keyEventHandlers = [callback];
                var e = $.Event('keydown');
                // click left
                e.which = 37;
                angular.element(window.document).triggerHandler(e);
                expect(keyTriggered).toEqual('left');
            });
        });
    });
});
