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
