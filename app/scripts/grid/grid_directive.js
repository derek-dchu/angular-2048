'use strict';

angular.module('Grid')
.directive('grid', function() {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            replace: true,
            templateUrl: 'scripts/grid/grid.html'
        }
    });