(function () {
    'use strict';

    // define controller
    var controllerId = 'login';
    angular.module('MnS.ActivityPlanner').controller(controllerId,
      ['$q', '$window', '$location', 'common', 'commonConfig', 'spContext', loginController]);

    // init controller
    function loginController($q,$window, $location, common, commonConfig, spContext) {
        var vm = this;
        vm.errorMessage = "";
        init();

        function showHideBusyDialog(show) {
            common.$broadcast(commonConfig.config.workingOnItToggleEvent, { show: show });
        };

        // init controller
        function init() {
            
            //bootstrap activity app
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);          
        }

        vm.login = function () {
            showHideBusyDialog(true);
            var deferred = spContext.login();
            deferred.then(function (authResult) {
                common.logger.log("User logged in", authResult, controllerId);
                showHideBusyDialog(false);
                $location.path('new');
            },
                function (error) {
                    common.logger.log("User logged in error", error, controllerId);
                    var d = confirm("An Error occured. Do you want to retry?\n" + JSON.stringify(error));
                    if (d) {
                        showHideBusyDialog(false);
                        init();
                    } else {
                        vm.errorMessage = JSON.stringify(error);
                        showHideBusyDialog(false);
                    }
                });
        }
    }
})();