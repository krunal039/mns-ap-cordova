﻿(function () {
    'use strict';

    // define controller
    var controllerId = 'workingonit';
    angular.module('MnS.ActivityPlanner').controller(controllerId,
      ['$rootScope','$route', '$timeout', 'common', 'config', workingonit]);

    function workingonit($rootScope, $route, $timeout, common, config) {
        var vm = this;
        vm.isWorking = true;
        $rootScope.isWorking = vm.isWorking;
        init();

        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        // wire handler to listen for toggling the working animation
        //    call it like this:
        //common.$broadcast(commonConfig.config.workingOnItToggleEvent, {show: false});
        $rootScope.$on(config.events.workingOnItToggle, function (event, data) {
            //common.logger.log('toggle working on it', data, controllerId);
            vm.isWorking = data.show;
        });

        // wire handler when route is changing to show
        //  working animation
        $rootScope.$on('$routeChangeStart',
          function (event, next, current) {
              common.logger.log('$routeChangeStart', event, controllerId);
              vm.isWorking = true;
          });

        // wire handler when route is finished changing to hide
        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            common.logger.log('$routeChangeSuccess', current, controllerId);
            // add short timeout to see the working dialog, otherwise it's too fast
            $timeout(function () {
                vm.isWorking = false;
            }, 0);
        });

    }
})();