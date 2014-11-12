(function() {
    var app = angular.module("io.atlantis.xbmc", [ 'io.atlantis' ]);

    var atlantisTile = function($ocLazyLoad, ColorService, ResourceService, $interval, dateFilter) {
        return {
            restrict: 'E',
            templateUrl: '/assets/plugins/io.atlantis.xbmc/module.tpl.html',
            link: function(scope) {
                ResourceService.get().then(function(config) {
                    scope.config = config;
                });

                scope.getRandomColor = ColorService.getRandomColor;

                timeoutId = $interval(function() {
                    scope.time = dateFilter(new Date(), 'M/d/yy h:mm:ss a');
                }, 1000);
            }
        }
    };

    app.directive('ioAtlantisXbmc', atlantisTile);

})();
