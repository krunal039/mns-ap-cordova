(function () {
    'use strict';

    // define controller
    var controllerId = 'apfilter';
    angular.module('MnS.ActivityPlanner').controller(controllerId,
      ['$scope','$window', '$location',  'common', 'config', 'spContext', 'datacontext', filterController]);

    // init controller
    function filterController($scope,$window, $location, common, config, spContext, datacontext) {
        var vm = this;
        vm.openPanel = false;
        vm.FilterValues = getFilersTypeChoices();

        vm.tradingFilter = tradingFilter;

        vm.shoHideFilters = showHideFilters;

        vm.filterData = applyFilter;

        function applyFilter() {
            vm.openPanel = !vm.openPanel;
            $('#filterModel').modal("hide");
            
            /*
            //Business Unit Filters Commented as requirement changed not to display it

            var buFilters = "";
            var selectedFilterElements = $("label.btn.btn-info.ap-item-filter0.ng-scope.active");
            if (selectedFilterElements && selectedFilterElements.length > 0) {
                buFilters = "@";
                var selectedBa = $("label.btn.btn-info.ap-item-filter0.ng-scope.active");
                selectedBa.each(function (index, item) {
                    buFilters += $(item).attr("data-ap-ba").split('##')[1] + (index < selectedBa.length - 1 ? "," : "@");
                });
            }*/

            var taFilters = "";
            var selectedFilterElements = $("label.btn.btn-info.ap-item-filter0.ng-scope.active");
            if (selectedFilterElements && selectedFilterElements.length > 0) {
                taFilters = "@";
                var selectedBa = $("label.btn.btn-info.ap-item-filter0.ng-scope.active");
                selectedBa.each(function (index, item) {
                    taFilters += $(item).attr("data-ap-ta").split('##')[1] + (index < selectedBa.length - 1 ? "," : "@");
                });
            }

            $location.path($location.path()).search({ 'taFilters': taFilters });
           
           
        }

        function showHideFilters() {
            if (($("#filterModel").data('bs.modal') || {}).isShown === undefined) {
                $('#filterModel').modal({ backdrop: 'static', keyboard: false });
            } else {
                $('#filterModel').modal("toggle");
            }
            
            vm.openPanel = !vm.openPanel;
        };

        function tradingFilter(val) {
            return function(item) {
                var activityTradingArea = (item["ActivityTradingArea"].ActivityTradingArea);
                var activityBusinessArea = (item["ActivityBusinessArea"]);
                if (val === activityTradingArea && val + " All" !== activityBusinessArea) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        function getFilersTypeChoices() {
            datacontext.getFiltersTypeChoices().then(function(data) {
                if (data) {
                    vm.FilterTradingItems = getTradingAreas(data);
                    vm.FilterItems = data;
                   
                } else {
                    throw new Error('no activity data found');
                }
            },
           function(error) {
               throw new Error(error);
           }).catch(function(error) {
               common.logger.logError('error obtaining activity data', error, controllerId);
           });
        };

        function getTradingAreas(items) {
            //var propertyName = "ActivityTradingArea";
            var result = [];
            var tradingAreaId = [];
            $.each(items, function (index, item) {
                var tradingArea = { id: item["ActivityTradingArea"].ID, title: item["ActivityTradingArea"].ActivityTradingArea };
                if ($.inArray(tradingArea.id, tradingAreaId) === -1) {
                    tradingAreaId.push(tradingArea.id);
                    result.push(tradingArea);
                }
            });
            return result;
        };

        init();

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }
       
    }
})();