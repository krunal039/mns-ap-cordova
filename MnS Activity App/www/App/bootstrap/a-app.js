(function () {
    'use strict';

    // create the app
    var app = angular.module('MnS.ActivityPlanner', [
 // ootb angular modules
    'ngRoute',          // app route (url path) support
    'ngCookies',        // cookie read/write support
    'ngAnimate',        // animation capabilities
   'ngSanitize',        // animation capabilities
   'angular-data.DSCacheFactory', //angular caching
    // my custom modules 
    'common'
    ]);

    // startup code
    app.run([
        '$route', 'angular.config', 'DSCacheFactory', function ($route, angularConfig, dsCacheFactory) {
            dsCacheFactory("activityAppConfigCache", { storageMode: "localStorage", maxAge: 2400000, deleteOnExpire: "aggressive" });
            dsCacheFactory("activityDataCache", { storageMode: "localStorage", maxAge: 720000, deleteOnExpire: "aggressive" });
            dsCacheFactory("activityBADataCache", { storageMode: "localStorage", maxAge: 720000, deleteOnExpire: "aggressive" });
            dsCacheFactory("activityOnGoingDataCache", { storageMode: "localStorage", maxAge: 720000, deleteOnExpire: "aggressive" });
            dsCacheFactory("activityLastYearDataCache", { storageMode: "localStorage", maxAge: 3600000 * 24, deleteOnExpire: "aggressive" });
        }
    ]);

    //enble html5 route mode to remove digest issue in ie 9
    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(false);
    });

})();