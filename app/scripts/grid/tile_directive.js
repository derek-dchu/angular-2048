angular.module('Grid')
.directive('tile', function() {
        return {
            restrict: 'E',
            scope: {
                tile: '='
            },
            replace: true,
            templateUrl: 'scripts/grid/tile.html'
        }
    });