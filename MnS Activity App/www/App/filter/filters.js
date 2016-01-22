(function () {
    'use strict';
    var countDownFilter = 'countDownFilter';
    angular.module('MnS.ActivityPlanner').filter(countDownFilter, function () {
        return function (input) {
            var activityStartDate = input.ActivityStartDate;
            var activityEndDate = input.ActivityEndDate;

            var resultHtml = "";
            activityEndDate = (Date.parse(activityEndDate));
            activityStartDate = (Date.parse(activityStartDate));

            var today = (new Date());
            var resultEndDate = parseInt((activityEndDate - today) / (24 * 3600 * 1000));
            var resultStartDate = parseInt((activityStartDate - today) / (24 * 3600 * 1000));
            var duration = parseInt((activityEndDate - activityStartDate) / (24 * 3600 * 1000));
            if (resultStartDate > 0) {
                resultHtml = "<span class='ap-item-title-duration ap-item-title-duration-no-started'>NOT STARTED</span>";
            } else if (resultEndDate > 0 ) {
                resultHtml = "<span class='ap-item-title-duration'>Days Left:</span><span class='ap-item-title-d'>&nbsp;&nbsp;" + resultEndDate + "</span>";
            } else if (resultEndDate === 0) {
                resultHtml = "<span class='ap-item-title-duration ap-item-title-duration-lastday'>LAST DAY</span>";
            }
            else if (resultEndDate < 0) {
                resultHtml = "<span class='ap-item-title-duration'>EXPIRED</span>";
            }
            return resultHtml;
        };
    });

    var dateFilter = 'dateFilter';
    angular.module('MnS.ActivityPlanner').filter(dateFilter, function () {
        return function (input, dateFormat, isUpperCase) {
            var result = "";
            var dateformat = "";
            switch (dateFormat) {
                case 1:
                    dateFormat = "dd";
                    break;
                case 2:
                    dateFormat = "DD";
                    break;
                case 3:
                    dateFormat = "DD MMMM YYYY";
                    break;
            }
            result = moment(Date.parse(input)).format(dateFormat);
            if (isUpperCase) {
                result = result.toUpperCase();
            }
            return result;
        };
    });

    var tradingAreaSubsection = 'tradingAreaSubsection';
    angular.module('MnS.ActivityPlanner').filter(tradingAreaSubsection, function () {
        return function (input) {
            var result = input;
            if (input && input.indexOf(" ") > -1) {
                result = input.substr(0, input.indexOf(' '));
            }
            return result.toLowerCase();
        };
    });
})();