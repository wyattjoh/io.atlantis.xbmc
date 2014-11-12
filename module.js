(function() {
    var app = angular.module("io.atlantis.xbmc", [ 'io.atlantis' ]);

    var atlantisTile = function($http, ColorService, ResourceService, $interval) {
        return {
            restrict: 'E',
            templateUrl: '/assets/plugins/io.atlantis.xbmc/module.tpl.html',
            link: function(scope) {
                ResourceService.get().then(function(config) {
                    scope.config = config;
                });

                var defaultPluginStyle = {
                    'background': '',
                    'display': 'none'
                };

                scope.pluginClasses = [];
                scope.pluginStyle = {
                    'background': '',
                    'display': 'none'
                };

                var updateFromPlayingItem = function(item) {
                    scope.currentlyPlaying = item;

                    scope.pluginStyle['display'] = 'block';

                    if (item["art"]["tvshow.banner"]) {
                        scope.pluginStyle['background'] = "url('http://xbmc.atlantis.io/image/" + encodeURIComponent(item["art"]["tvshow.banner"]) + "')";
                        scope.pluginClasses = [];
                    } else {
                        scope.pluginStyle['background'] = "url('http://xbmc.atlantis.io/image/" + encodeURIComponent(item.art.fanart) + "')";
                        scope.pluginClasses = ["movie-animated"];
                    }
                };

                var updateFromXbmc = function() {
                    $http.post("http://xbmc.atlantis.io/jsonrpc", {"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1})
                        .success(function(response) {
                            if (response.result.length) {

                                var video_properties = {
                                    "jsonrpc": "2.0",
                                    "method": "Player.GetItem",
                                    "params": { "properties": [ "showtitle", "fanart", "art" ], "playerid": 1 },
                                    "id": "VideoGetItem"
                                };

                                $http.post("http://xbmc.atlantis.io/jsonrpc", video_properties)
                                    .success(function(data) {
                                        console.log(data);

                                        if (data.result) {
                                            // Update the UI
                                            updateFromPlayingItem(data.result.item);
                                        }
                                    });
                            } else {
                                // There is nothing playing, clear the ui
                                for (var key in defaultPluginStyle) {
                                    scope.pluginStyle[key] = defaultPluginStyle[key];
                                }

                                scope.currentlyPlaying = null;
                            }
                        });
                };

                updateFromXbmc();

                $interval(updateFromXbmc, 2000);

                scope.getRandomColor = ColorService.getRandomColor;
            }
        }
    };

    app.directive('ioAtlantisXbmc', atlantisTile);

})();
