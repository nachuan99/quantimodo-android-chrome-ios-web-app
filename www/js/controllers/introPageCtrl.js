angular.module('starter')

    // Controls the Track Page of the App
    .controller('IntroPageCtrl', function($scope, $ionicModal, $state, $timeout, utilsService, authService,
                                      measurementService, chartService, $ionicPopup, localStorageService, $ionicLoading,
                                          $ionicSlideBoxDelegate) {
        $scope.controller_name = "IntroPageCtrl";

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
                    $state.go(config.appSettings.defaultState);
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
                }
            };

            var init = function(){
                utilsService.loadingStart();
                $scope.myIntro.ready = true;
                $ionicLoading.hide();
            };

            // when view is changed
            $scope.$on(
                '$ionicView.enter', function(e) {
                    init();
                }
            );
        }
    );