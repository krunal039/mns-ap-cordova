(function () {
    'use strict';

    // create app
    var app = angular.module('MnS.ActivityPlanner', ['common', 'ngCookies', 'angular-data.DSCacheFactory']);

    app.run([
       'DSCacheFactory', function (dsCacheFactory) {
           dsCacheFactory("activityAppConfigCache", { storageMode: "localStorage", maxAge: 2400000, deleteOnExpire: "aggressive" });
       }
    ]);

    // configure angular logging service before startup
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);
    var loggerSource;
    var controllerId;

    function appLauncher($log, common, spContext) {

        // init the controller
        init();

        function init() {
            $log.log(loggerSource, "controller loaded", null, controllerId);
            common.activateController([], controllerId);
            login();
        }

        function login() {
            var deferred = spContext.login();
            deferred.then(function (authResult) {
                common.logger.log("User logged in", authResult, controllerId);
                    window.location = "app.html";
                },
                function (error) {
                    common.logger.log("User logged in error", error, controllerId);
                    var d = confirm("An Error occured. Do you want to retry?\n" + JSON.stringify(error));
                    if (d) {
                       
                        init();
                    } else {
                        vm.errorMessage = JSON.stringify(error);
                       
                    }
                });
        }
    };

    // create controller
    controllerId = 'appLauncher';
    loggerSource = '[' + controllerId + '] ';
    app.controller(controllerId,
      ['$log', 'common', 'spContext', appLauncher]);

    
})();