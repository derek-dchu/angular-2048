angular.module('Grid')
.directive('tile', function() {
        return {
            restrict: 'E',
            scope: {
                ngModel: '='
            },
            replace: true,
            templateUrl: 'scripts/grid/tile.html'
        }
    });