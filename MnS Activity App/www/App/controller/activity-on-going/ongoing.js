(function () {
    'use strict';

    // define controller
    var controllerId = "activityOngoing";
    angular.module('MnS.ActivityPlanner').controller(controllerId,
      ['$location', 'common', 'datacontext', 'commonConfig', activityOngoing]);

    // create controller
    function activityOngoing($location, common, datacontext, commonConfig) {
        var vm = this;
        vm.siteHost = "";
        // navigate to the specified item
       
        vm.noData = false;

        function getActivityPlannerOnGoingItems() {
            var filters = $location.search();
            datacontext.getOngoingActivityPartials(filters)
                .then(function(data) {
                    if (data && data.length > 0) {
                            vm.noData = false;
                            vm.activityItems = data;
                            vm.activityGroupBy = groupStartDate(vm.activityItems);
                        } else {
                            vm.noData = true;
                        }
                        showHideBusyDialog(false);
                    },
                    function (error) {
                        vm.noData = true;
                        common.logger.log("Error/No Data", error, controllerId);
                        showHideBusyDialog(false);
                    });
        };

        function showHideBusyDialog(show) {
            common.$broadcast(commonConfig.config.workingOnItToggleEvent, { show: show });
        };
        vm.dateFilter = function(val) {
            return function(item) {
                var currentDate = new Date(val);
                var itemDate = new Date(item["ActivityStartDate"]);
                //var startofWeek = getStartOfWeek(item["ActivityStartDate"]);
                var endOfWeek = new Date(currentDate);
                var numberOfDaysToAdd = 7;
                endOfWeek.setDate(endOfWeek.getDate() + numberOfDaysToAdd);

                if (itemDate < endOfWeek && itemDate >= currentDate) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        function getStartOfWeek(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day;
            return new Date(d.setDate(diff));
        };

        function findParentDiv(target) {

            while (target.attributes["data-apitem-id"] === undefined) {
                target = (target.parentElement);
            }
            return target.attributes["data-apitem-id"].value;
        }

        function showDetails($event) {
            if ($event.target.attributes["data-item-attachment"] === undefined) {
                var gId = findParentDiv($event.target);
                var showHideSpan = $("#spanShowHide" + gId);
                var currentClass = showHideSpan.attr('class');
                if (currentClass.indexOf("ion-arrow-down-b") > -1) {
                    $('.ion-arrow-up-b').attr('class', 'ion-arrow-down-b');
                    $("div").find('[data-ap-description]').hide("slow");
                    $("div").find('[data-ap-attachment]').hide("slow");
                    $("#apDescriptionDiv" + gId).show("slow");
                    $("#apAttachmentDiv" + gId).show("slow");
                    showHideSpan.attr('class', 'ion-arrow-up-b');
                } else {
                    showHideSpan.attr('class', 'ion-arrow-down-b');
                    $("#apDescriptionDiv" + gId).hide("slow");
                    $("#apAttachmentDiv" + gId).hide("slow");
                }
            }
        };

        function groupStartDate(items) {
            var propertyName = "ActivityStartDate", isDateFormat = true, titleDateFormat = "DD MMMM";
            var result = [];
            var dummyArray = [];
            $.each(items, function (index, item) {
                var itemDate = getStartOfWeek(new Date(item[propertyName]));
                if ($.inArray(itemDate.toDateString(), dummyArray) === -1) {
                    if (isDateFormat) {
                        var temp = {};
                        temp.original_date = itemDate;
                        temp.main_title_date = moment(temp.original_date).format(titleDateFormat);

                        dummyArray.push(temp.original_date.toDateString());
                        result.push(temp);
                    } else {
                        result.push(item[propertyName]);
                    }
                }
            });
            return result;
        };

        // init controller
        init();
        vm.showDetails = showDetails;

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            getHostName();
            getActivityPlannerOnGoingItems();
            common.activateController([], controllerId);
        };

        // navigate to the specified item
        function getHostName() {
            vm.siteHost = datacontext.getHostWebUrl();
        };

    };

})();