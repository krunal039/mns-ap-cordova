(function () {
    'use strict';

    var app = angular.module('MnS.ActivityPlanner');

    // get all the routes
    app.constant('routes', getRoutes());

    // config routes & their resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);

    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (route) {
            $routeProvider.when(route.url, route.config);
        });

        $routeProvider.otherwise({ redirectTo: '/login' });
    }

    // build the routes
    function getRoutes() {
        return [
            {
                url: '/login',
                config: {
                    templateUrl: 'app/controller/activity-login/login.html',
                    title: 'Login',
                    settings: {
                        nav: 1,
                        content: 'Login',
                        quickLaunchEnabled: false,
                        showFilter: false
                    }
                }
            },
          {
              url: '/new',
              config: {
                  templateUrl: 'app/controller/activity-new/new.html',
                  title: 'New',
                  settings: {
                      nav: 1,
                      content: 'New',
                      quickLaunchEnabled: true,
                      showFilter : true
                  }
              }
          },
          {
              url: '/on-going',
              config: {
                  templateUrl: 'app/controller/activity-on-going/ongoing.html',
                  title: 'On Going',
                  settings: {
                      nav: 2,
                      content: 'On Going',
                      quickLaunchEnabled: true,
                      showFilter: true
                  }
              }
          },
          {
              url: '/last-year',
              config: {
                  templateUrl: 'app/controller/activity-last-year/lastyear.html',
                  title: 'Last Year',
                  settings: {
                      nav: 3,
                      content: 'Last Year',
                      quickLaunchEnabled: true,
                      showFilter: true
                  }
              }
          }
        ];
    }
})();