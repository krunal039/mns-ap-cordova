(function () {
    'use strict';

    // define factory
    var serviceId = 'datacontext';
    angular.module('MnS.ActivityPlanner').factory(serviceId,
      ['$rootScope', '$cookieStore', '$http', '$q', 'config', 'common', 'spContext', 'DSCacheFactory', datacontext]);

    function datacontext($rootScope, $cookieStore, $http, $q, config, common, spContext, dsCacheFactory) {

        self.activityDataCache = dsCacheFactory.get("activityDataCache");
        self.activityLastYearDataCache = dsCacheFactory.get("activityLastYearDataCache");
        self.activityOnGoingDataCache = dsCacheFactory.get("activityOnGoingDataCache");
        self.activityBADataCache = dsCacheFactory.get("activityBADataCache");

        self.activityDataCache.setOptions({
            onExpire: function (key, value) {
                getActivityData()
                    .then(function () {
                        common.logger.log("Activity Cache was automatically refreshed.", {}, serviceId);
                    }, function () {
                        common.logger.log("Error getting data. Putting expired item back in the cache.", {}, serviceId);
                        self.activityDataCache.put(key, value);
                    });
            }
        });

        self.activityBADataCache.setOptions({
            onExpire: function (key, value) {
                getBusinessAreaData()
                    .then(function () {
                        common.logger.log("Business Area Cache was automatically refreshed." , {}, serviceId);
                    }, function () {
                        common.logger.log("Business Area. Putting expired item back in the cache.", {}, serviceId);
                        self.activityBADataCache.put(key, value);
                    });
            }
        });

        self.activityLastYearDataCache.setOptions({
            onExpire: function (key, value) {
                getActivityLastYearData()
                    .then(function () {
                        common.logger.log("Last Year Activity Area Cache was automatically refreshed.", {}, serviceId);
                    }, function () {
                        common.logger.log("Last Year. Putting expired item back in the cache.", {}, serviceId);
                        self.activityBADataCache.put(key, value);
                    });
            }
        });

        self.activityOnGoingDataCache.setOptions({
            onExpire: function (key, value) {
                getActivityOnGoingData()
                    .then(function () {
                        common.logger.log("On Going Activity Area Cache was automatically refreshed.", {}, serviceId);
                    }, function () {
                        common.logger.log("On Going Activity. Putting expired item back in the cache.", {}, serviceId);
                        self.activityBADataCache.put(key, value);
                    });
            }
        });

        function getBusinessAreaData() {
            var deferred = $q.defer(),
               cacheKey = "businessArea",
               businessAreaData = self.activityBADataCache.get(cacheKey);

            if (businessAreaData) {
                common.logger.log("Found Business Area data inside cache", businessAreaData, serviceId);
                deferred.resolve(businessAreaData);
            } else {
                var request = buildFiltersTypeChoicesResources();
                loadDataVia$http(request).then(function (data) {
                    if (data) {
                        self.activityBADataCache.put(cacheKey, data);
                        common.logger.log("retrieved business are items", data, serviceId);
                        deferred.resolve(data);
                    }
                }, function (error) {
                    deferred.reject(error);
                    common.logger.error("error while retriving business area data", error, serviceId);
                });
            }
            return deferred.promise;
        };

        function getActivityData() {

            var deferred = $q.defer(),
            cacheKey = "activityData",
            activityData = self.activityDataCache.get(cacheKey);

            if (activityData) {
                common.logger.log("Found Activity data inside cache ", activityData, serviceId);
                deferred.resolve(activityData);
            } else {
                var startOfWeek = getStartOfWeek(new Date());
                var endOfWeek = new Date(startOfWeek);
                var numberOfDaysToAdd = 56;
                endOfWeek.setDate(endOfWeek.getDate() + numberOfDaysToAdd);

                var filter = "ActivityStartDate ge datetime\'" + startOfWeek + "\' and ActivityStartDate le datetime\'" + endOfWeek.toISOString() + "\'";

                var request = buildActivityItemRequestRequest(filter);
                loadDataVia$http(request).then(function (data) {
                    if (data) {
                        common.logger.log("retrieved Activity items", data, serviceId);
                        self.activityDataCache.put(cacheKey, data);
                        deferred.resolve(data);

                    }
                }, function (error) {
                    deferred.reject(error);
                    common.logger.error("error while retriving Activity items", error, serviceId);
                });
            }
            return deferred.promise;
        };

        function getActivityLastYearData() {

            var deferred = $q.defer();

            var cacheKey = "activityLastYearData",
            activityLastYearData = self.activityLastYearDataCache.get(cacheKey);

            if (activityLastYearData) {
                common.logger.log("Found Last Year Activity data inside cache", activityLastYearData, serviceId);
                deferred.resolve(activityLastYearData);
            } else {
                var lastYear = new Date().getFullYear() - 1;
                var startDate = new Date("01/01/" + lastYear).toISOString();
                var endDate = new Date("12/31/" + lastYear).toISOString();
                var filter = "ActivityStartDate ge datetime\'" + startDate + "\' and ActivityEndDate le datetime\'" + endDate + "\'";
                var request = buildActivityItemRequestRequest(filter);

                loadDataVia$http(request).then(function (data) {
                    if (data) {
                        self.activityLastYearDataCache.put(cacheKey, data);
                        common.logger.log("retrieved Last year items", data, serviceId);
                        deferred.resolve(data);

                    }
                }, function (error) {
                    deferred.reject(error);
                    common.logger.error("error while retriving business area data", error, serviceId);
                });
            }
            return deferred.promise;
        };

        function getActivityOnGoingData() {
            var deferred = $q.defer();

            var cacheKey = "activityOnGoingData",
            activityOnGoingDataData = self.activityOnGoingDataCache.get(cacheKey);

            if (activityOnGoingDataData) {
                common.logger.log("Found On Going Activity data inside cache", activityOnGoingDataData, serviceId);
                deferred.resolve(activityOnGoingDataData);
            } else {
                var today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
                var filter = "ActivityStartDate le datetime\'" + today + "\' and ActivityEndDate ge datetime\'" + today + "\'";
                var request = buildActivityItemRequestRequest(filter);

                loadDataVia$http(request).then(function (data) {
                    if (data) {
                        self.activityOnGoingDataCache.put(cacheKey, data);
                        common.logger.log("retrieved all ongoing activity Items", data, serviceId);
                        deferred.resolve(data);
                    }
                }, function (error) {
                    deferred.reject(error);
                    common.logger.error("retrieved all ongoing activity Items", error, serviceId);
                });
            }
            return deferred.promise;
        };

        function getStartOfWeek(d) {
            d = new Date(d);
            d.setHours(0, 0, 0, 0);
            var day = d.getDay(),
                diff = d.getDate() - (day + 1);
            return (new Date(d.setDate(diff)).toISOString());

        };

        function createTaFilter(filters) {
            var taFilterValue = [];
            if (filters && filters.taFilters) {
                var filterValues = filters.taFilters.replace(/@/g, "").split(",");
                $.each(filterValues, function (index, value) {
                    var filterValue = value;
                    taFilterValue.push({ 'ActivityTradingAreaId': filterValue });
                });
            }

            return taFilterValue;
        }

        function getActivityBookingsAll(filters) {
            var deferred = $q.defer();
            var taFilterValue = createTaFilter(filters);
            getActivityData().then(
                function (data) {
                    if (data) {
                        var result = filterActivityDataByTa(taFilterValue, data);
                        //common.logger.log("retrieved all activity Items", data, serviceId);
                        deferred.resolve(result);
                    }
                }, function (error) {
                    deferred.reject(error);
                    //common.logger.error("retrieved all activity Items", error, serviceId);
                });

            return deferred.promise;
        };

        function getOngoingActivity(filters) {
            var deferred = $q.defer();
            var taFilterValue = createTaFilter(filters);

            getActivityOnGoingData().then(function (data) {
                if (data) {
                    var result = filterActivityDataByTa(taFilterValue, data);
                    //common.logger.log("retrieved all ongoing activity Items", data, serviceId);
                    deferred.resolve(result);
                }
            }, function (error) {
                deferred.reject(error);
                //common.logger.error("retrieved all ongoing activity Items", error, serviceId);
            });

            return deferred.promise;
        }

        function getLastYearActivity(filters) {
            var deferred = $q.defer();
            var taFilterValue = createTaFilter(filters);

            getActivityLastYearData().then(function (data) {
                if (data) {
                    var result = filterActivityDataByTa(taFilterValue, data);
                    //common.logger.log("retrieved all last year activity Items", data, serviceId);
                    deferred.resolve(result);
                }
            }, function (error) {
                deferred.reject(error);
                //common.logger.error("retrieved all last year activity Items", error, serviceId);
            });

            return deferred.promise;
        }

        function loadDataVia$http(url) {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Authorization": "Bearer " + spContext.accessToken
                }
            };

            $http(req).then( function (data) {
                var jsonObject = JSON.parse(data.body);
                if (jsonObject) {
                    var results = jsonObject.d.results;
                    deferred.resolve(results);
                } else {
                    deferred.reject("401");
                }
            },
                function (data, errorCode, errorMessage) {
                deferred.reject(errorMessage);
                });

            return deferred.promise;
        }

        function loadDataViaRequestExecutor(url) {
            var deferred = $q.defer();
            var scriptbase = spContext.hostWeb.url + "/_layouts/15/";
            $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
                var executor = new SP.RequestExecutor(spContext.hostWeb.appWebUrl);
                executor.executeAsync(
                {
                    url: spContext.hostWeb.appWebUrl + url,
                    method: "GET",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        var jsonObject = JSON.parse(data.body);
                        if (jsonObject) {
                            var results = jsonObject.d.results;
                            deferred.resolve(results);
                        } else {
                            deferred.reject("401");
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        deferred.reject(errorMessage);
                    }
                }
            );
            });

            return deferred.promise;
        };

        function buildActivityItemRequestRequest(filter) {

            var request = spContext.hostWeb.url + '_api/web/lists/GetByTitle(\'Activity Booking\')/items?' +
                '$select=ID,Attachments,ActivityTitle,ActivityDescription,ActivityStartDate,ActivityEndDate,ActivityShowInHistory,ActivityIsUpdated,ActivityTradingAreaId,ActivityTradingArea/ActivityTradingArea,ActivityBusinessAreaId,ActivityBusinessArea/ActivityBusinessArea,AttachmentFiles,ActivityUpdatedDate,ActivityDuration' +
                '&$orderBy=ActivityStartDate desc' +
                '&$expand=ActivityTradingArea,ActivityBusinessArea,AttachmentFiles,ActivityTradingArea/Id,ActivityBusinessArea/Id' +
                 (filter ? "&$filter=" + filter : "");

            return request;

        };

        function filterActivityDataByTa(filters, activityData) {
            if (filters && filters.length > 0) {
                var lookup = _.indexBy(filters, function(o) { return o.ActivityTradingAreaId.toString() });
                var result = _.filter(activityData, function(u) {
                    return lookup[u.ActivityTradingAreaId.toString()] !== undefined;
                });
                return result;
            } else {
                return activityData;
            }
        };

        function getHostWebUrl() {
            return spContext.hostWeb.url;
        }

        function buildFiltersTypeChoicesResources(filter) {

            var request = spContext.hostWeb.url+ '_api/web/lists/GetByTitle(\'Activity Business Area\')/items?' +
                '$select=ActivityTradingArea/ID, ID, ActivityTradingArea/ActivityTradingArea,ActivityBusinessArea' +
                '&$orderBy=ActivityTradingArea/ActivityTradingArea asc, ActivityBusinessArea asc' +
                '&$expand=ActivityTradingArea' +
                 (filter ? "&$filter=" + filter : "");

            return request;

        };

        //private function
        function init() {
            common.logger.log("service loaded", null, serviceId);
        };

        //init function to load data context
        init();
        return {
            // mns activity planner members
            getFiltersTypeChoices: getBusinessAreaData,
            getActivityBookingPartials: getActivityBookingsAll,
            getOngoingActivityPartials: getOngoingActivity,
            getActivityPlannerLastYearItemsPartials: getLastYearActivity,
            getHostWebUrl: getHostWebUrl
        };
    }
})();