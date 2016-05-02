angular.module('starter')
.controller('IntroCtrl', function($scope, $state, localStorageService, $ionicSlideBoxDelegate, $ionicLoading) {
    
    $scope.viewTitle = config.appSettings.appName;
    $scope.primaryOutcomeVariable = config.appSettings.primaryOutcomeVariable;
    $scope.primaryOutcomeVariableRatingOptions = config.getPrimaryOutcomeVariableOptions();
    $scope.primaryOutcomeVariableNumbers = config.getPrimaryOutcomeVariableOptions(true);
    $scope.introConfiguration = config.appSettings.intro;
    
    $scope.myIntro = {
        ready : false,

        slideIndex : 0,
        // Called to navigate to the main app
        startApp : function() {
            localStorageService.setItem('introSeen', true);
            $state.go(config.appSettings.welcomeState);
        },

        next : function() {
            $ionicSlideBoxDelegate.next();
        },

        previous : function() {
            $ionicSlideBoxDelegate.previous();
        },

        // Called each time the slide changes
        slideChanged : function(index) {
            $scope.myIntro.slideIndex = index;
        },
    };

    var init = function(){
        // show loader
        $ionicLoading.show({
            noBackdrop: true,
            template: '<p class="item-icon-left">Loading stuff...<ion-spinner icon="lines"/></p>'
        });

        localStorageService.getItem('introSeen', function(introSeen){
            if(introSeen){
                $state.go('app.welcome');
            } else {
                $scope.myIntro.ready = true;
            }
            $ionicLoading.hide();
        });
    };

    // when view is changed
    $scope.$on('$ionicView.enter', function(e) {
        init();
    });

});
