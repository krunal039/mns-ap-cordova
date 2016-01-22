(function () {
    'use strict';

    var serviceId = 'spContext';
    var loggerSource = '[' + serviceId + '] ';
    angular.module('MnS.ActivityPlanner').service(serviceId, [
      '$q', 'common', 'DSCacheFactory', spContext]);

    function spContext($q, common, dsCacheFactory) {

        bindEvents();

        self.activityAppConfig = dsCacheFactory.get("activityAppConfigCache");

        self.activityAppConfig.setOptions({
            onExpire: function (key, value) {
                createSpAppContext()
                    .then(function () {
                        common.logger.log("user token was automatically refreshed.", {}, serviceId);
                    }, function () {
                        common.logger.log("Error getting user token. Putting expired item back in the cache.", {}, serviceId);
                        self.activityAppConfig.put(key, value);
                    });
            }
        });

        var adalConfig = {
            authority: 'https://activity-login.windows.net/kmpdev.onmicrosoft.com',
            resourceUrl: 'https://kmpdev.sharepoint.com/',
            appId: '4773b87f-3701-487c-b0cb-93ff4ac893c4',
            redirectUrl: 'http://localhost:4400/services/aad/redirectTarget.html',
            tenantName: 'development'
        }

        var loginContext = {
            authenticationContext: null,
            authContext: null,
            authResult: null,
            accessToken: null
        };

        var hostWeb = {
            url: adalConfig.resourceUrl + "sites/pinterest/"
        };

        function bindEvents() {
            document.addEventListener('deviceready', createAuthContext, false);
        };

        function createAuthContext() {
            loginContext.authenticationContext = Microsoft.ADAL.AuthenticationContext;
        };

        function createContext() {
            var deferred = $q.defer();
            loginContext.authenticationContext = Microsoft.ADAL.AuthenticationContext;

            loginContext.authenticationContext.createAsync(adalConfig.authority)
              .then(function (context) {
                  loginContext.authContext = context;
                  common.logger.log('Created context successfully: ', context, serviceId);
                  deferred.resolve(context);
              }, function (error) {
                  common.logger.error('Error in creating context successfully: ', error, serviceId);
                  deferred.reject(error);
              });
            return deferred.promise;
        };

        function acquireToken() {
            var deferred = $q.defer();
            createContext().then(function (authContext) {
                loginContext.authContext.acquireTokenAsync(adalConfig.resourceUrl, adalConfig.appId, adalConfig.redirectUrl)
              .then(function (authResult) {
                  loginContext.authResult = authResult;
                  loginContext.accessToken = context.accessToken;
                  deferred.resolve(authResult);
              }, function (error) {
                  deferred.reject(error);
              });

            }, function (error) {
                deferred.reject(error);
            });



            return deferred.promise;
        };

        function stubAcquireToken(deferred) {
            var testUserId;
            loginContext.authContext.tokenCache.readItems().then(function (cacheItems) {
                if (cacheItems.length > 1) {
                    testUserId = cacheItems[0].userInfo.userId;
                }

                loginContext.authContext.acquireTokenSilentAsync(adalConfig.resourceUrl, adalConfig.appId, testUserId).then(function (authResult) {
                    common.logger.log('Acquired token successfully: ', authResult, serviceId);
                    loginContext.authResult = authResult;
                    loginContext.accessToken = context.accessToken;
                    deferred.resolve(authResult);
                }, function (error) {
                    common.logger.error('Failed to acquire token silently: ', error, serviceId);
                    deferred.reject('Failed to acquire token silently');
                });
            }, function (error) {
                acquireToken().then(
                    function (authResult) {
                        deferred.resolve(error);
                    }, function (error) {
                    deferred.reject(error);
                })
                deferred.reject(error);
            });
        };

        function acquireTokenSilent() {

            var deferred = $q.defer();
            createContext().then(
                function (context) {
                    stubAcquireToken(deferred);
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };


        function readTokenCache() {
            var deferred = $q.defer();
            if (loginContext.authContext == null) {
                common.logger.log('Authentication context isn\'t created yet. going to create context', {}, serviceId);
                createContext();
            }

            loginContext.authContext.tokenCache.readItems()
              .then(function (res) {
                  common.logger.log('Read token cache successfully. There is ' + res.length + ' items stored.', res, serviceId);
                  loginContext.authContext = res;
                  deferred.resolve(res);
              }, function (error) {
                  common.logger.error('Failed to read token cache: ', error, serviceId);
                  deferred.reject(error);
              });

            return deferred.promise;
        };

        function clearTokenCache() {
            var deferred = $q.defer();
            if (loginContext.authContext == null) {
                common.logger.log('Authentication context isn\'t created yet. going to create context', {}, serviceId);
                createContext();
            }

            loginContext.authContext.tokenCache.clear().then(function () {
                common.logger.log('Cache cleaned up successfully.', {}, serviceId);
                deferred.resolve('Cache cleaned up successfully.');

            }, function (error) {
                common.logger.error('Cache cleaned up successfully.', error, serviceId);
                deferred.reject('Failed to clear token cache: ');

            });

            return deferred.promise;
        }

        function createSpAppContext() {
            var deferred = $q.defer();

            var cacheKey = "loginContextData",
              appLoginData = self.activityAppConfig.get(cacheKey);
            if (appLoginData && appLoginData.expireOn && new Date(appLoginData.expireOn) > new Date()) {
                common.logger.log("Found App config data inside cache", appConfigData, serviceId);
                loginContext.authContext = appLoginData;
                loginContext.accessToken = appLoginData.accessToken;
                deferred.resolve(appLoginData);
            }
            else {
                common.logger.log(loggerSource, 'createing spcontext for app to authenticate and authorize', null);
                var $getTokenSilent = acquireTokenSilent();
                $getTokenSilent.then(
                    function (authResult) {
                        loginContext.accessToken = authResult.accessToken;
                        loginContext.authResult = authResult;
                        self.activityAppConfig.put(cacheKey, authResult);
                        deferred.resolve(authResult);
                    },
                    function (error) {
                        common.logger.error('Failed to acquire token silently. calling acquireToken.', error, serviceId);
                        var $acquireToken = acquireToken();
                        $acquireToken.then(
                            function (authResult) {
                                common.logger.log('Acquired token successfully: ', authResult, serviceId);
                                loginContext.accessToken = authResult.accessToken;
                                loginContext.authResult = authResult;
                                self.activityAppConfig.put(cacheKey, authResult);
                                deferred.resolve(authResult);
                            },
                            function (error) {
                                common.logger.error('Error in acquired token: ', error, serviceId);
                                deferred.reject(error);
                            });
                    });
            }
            return deferred.promise;
        }

        return {
            loginContext: loginContext,
            login: createSpAppContext,
            adalContext: adalConfig,
            hostWeb: hostWeb
        }
    }
})();
