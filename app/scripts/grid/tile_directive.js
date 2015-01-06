'use strict';

angular.module('Grid')
.directive('tile', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            templateUrl: 'tileId.html'
        };
    });