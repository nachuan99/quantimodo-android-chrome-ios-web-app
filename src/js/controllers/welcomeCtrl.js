angular.module('starter').controller('WelcomeCtrl', ["$scope", "$state", "$rootScope", "qmService", "qmLogService", "$stateParams", function($scope, $state, $rootScope, qmService, qmLogService, $stateParams) {
    $scope.controller_name = "WelcomeCtrl";
    $rootScope.hideNavigationMenu = true;
    $scope.reportedVariableValue = false;
    $rootScope.showFilterBarSearchIcon = false;
    qmService.qmStorage.getAsStringWithCallback('primaryOutcomeRatingFrequencyDescription',
        function(primaryOutcomeRatingFrequencyDescription) {
            if (primaryOutcomeRatingFrequencyDescription) {$scope.primaryOutcomeRatingFrequencyDescription = primaryOutcomeRatingFrequencyDescription;}
            if (!primaryOutcomeRatingFrequencyDescription && $rootScope.isIOS) {$scope.primaryOutcomeRatingFrequencyDescription = 'day';}
            if (!primaryOutcomeRatingFrequencyDescription && !$rootScope.isIOS) {$scope.primaryOutcomeRatingFrequencyDescription = 'daily';}
        }
    );
    $scope.sendReminderNotificationEmails = true;
    $rootScope.sendDailyEmailReminder = true;
    $scope.saveIntervalAndGoToLogin = function(primaryOutcomeRatingFrequencyDescription){
        $scope.saveInterval(primaryOutcomeRatingFrequencyDescription);
        qmService.sendToLogin();
    };
    $scope.skipInterval = function(){
        $scope.showIntervalCard = false;
        qmLogService.debug(null, 'skipInterval: Going to login state...', null);
        qmService.sendToLogin();
    };
    $scope.saveInterval = function(primaryOutcomeRatingFrequencyDescription){
        if(primaryOutcomeRatingFrequencyDescription){$scope.primaryOutcomeRatingFrequencyDescription = primaryOutcomeRatingFrequencyDescription;}
        var intervals = {
            "minutely" : 60,
            "every five minutes" : 5 * 60,
            "never" : 0,
            "hourly": 60 * 60,
            "hour": 60 * 60,
            "every three hours" : 3 * 60 * 60,
            "twice a day" : 12 * 60 * 60,
            "daily" : 24 * 60 * 60,
            "day" : 24 * 60 * 60
        };
        var reminderToSchedule = {
            reminderFrequency: intervals[$scope.primaryOutcomeRatingFrequencyDescription],
            variableId: qmService.getPrimaryOutcomeVariable().id,
            defaultValue: 3
        };
        qmService.addToTrackingReminderSyncQueue(reminderToSchedule);
        $scope.showIntervalCard = false;
    }
    $scope.storeRatingLocally = function(ratingValue){
        $scope.reportedVariableValue = qmService.getPrimaryOutcomeVariable().ratingTextToValueConversionDataSet[ratingValue] ? qmService.getPrimaryOutcomeVariable().ratingTextToValueConversionDataSet[ratingValue] : false;
        var primaryOutcomeMeasurement = qmService.createPrimaryOutcomeMeasurement(ratingValue);
        qmService.addToMeasurementsQueue(primaryOutcomeMeasurement);
        $scope.hidePrimaryOutcomeVariableCard = true;
        $scope.showIntervalCard = true;
    };
    $scope.init = function(){
        $rootScope.hideNavigationMenu = true;
        qmLogService.debug(null, $state.current.name + ' initializing...', null);

    };
    $scope.$on('$ionicView.beforeEnter', function(){
        if($rootScope.user){
            qmLogService.debug(null, 'Already have user so no need to welcome. Going to default state.', null);
            qmService.goToState(config.appSettings.appDesign.defaultState);
        }
    });
    $scope.init();
}]);
