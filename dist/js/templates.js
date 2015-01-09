angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("mainId.html","<div id=\"content\" ng-controller=\"GameController as gctrl\">\n    <div class=\"row\">\n        <div id=\"game-board\" class=\"col-md-9\">\n            <div grid ng-model=\"gctrl.gameManager\"></div>\n        </div>\n        <div id=\"user-board\" class=\"col-md-3\">\n            <div class=\"score\">\n                <p>Current Score: {{ gctrl.gameManager.currentScore }}</p>\n            </div>\n            <div class=\"best-score\">\n                <p>Best Score: {{ gctrl.gameManager.bestScore }}</p>\n            </div>\n        </div>\n    </div>\n    <!-- Game Over display -->\n    <div class=\"row\">\n        <div id=\"game-over\" ng-if=\"gameCtrl.gameManager.gameOver\" class=\"row game-overlay\">\n            <p>Game Over</p>\n            <div class=\"lower\">\n                <a class=\"retry-btn\" ng-click=\"gameCtrl.newGame()\">Try again</a>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("gridId.html","<div class=\"grid-container\">\n    <div class=\"grid-cell\"\n         ng-repeat=\"cell in ngModel.grid track by $index\"></div>\n</div>\n<div class=\"tile-container\">\n    <div tile\n         ng-model=\"tile\"\n         ng-repeat=\"tile in ngModel.tiles track by $id(tile.id || $index)\"></div>\n</div>");
$templateCache.put("tileId.html","<div ng-if=\"ngModel\" class=\"tile tile-{{ ngModel.value }} position-{{ ngModel.coordinate.x }}-{{ ngModel.coordinate.y }}\">\n    <div class=\"tile-inner\">\n        {{ ngModel.value }}\n    </div>\n</div>");}]);