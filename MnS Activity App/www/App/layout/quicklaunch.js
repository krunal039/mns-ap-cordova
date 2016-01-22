(function () {
    'use strict';

    // define controller
    var controllerId = 'quicklaunch';
    angular.module('MnS.ActivityPlanner').controller(controllerId,
      ['$rootScope','$route', 'config', 'common', 'routes', quickLaunch]);

    // init controller
    function quickLaunch($rootScope, $route, config, common, routes) {

        $rootScope.$on("$routeChangeSuccess", function (e, current) {
                var showFilters = routes.filter(function (route) {
                    return route.config.settings && route.config.settings.nav && route.templateUrl === current.$$route.templateUrl && route.config.settings.showFilter;
                });
                if (showFilters) {
                    $rootScope.query = $.param(current.params);
                }
            });
      
        var vm = this;
        // utility method to see if the provided route is the current route
        vm.isCurrent = isCurrent;

        // utility method to see if the provided route is the current route
        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return false;
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? true : false;
        }
        // #endroute

        // #region private members
        // load all navigatino routes
        function getNavigationRoutes() {
            // only retrieve routes flagged quickLaunchEnabled = true & sort them
            vm.navRoutes = routes.filter(function (route) {
                return route.config.settings && route.config.settings.nav && route.config.settings.quickLaunchEnabled;
            }).sort(function (routeA, routeB) {
                return routeA.config.settings.nav > routeB.config.settings.nav;
            });
        }

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            getNavigationRoutes();
        }

        // init controller
        init();
       
    }
})();