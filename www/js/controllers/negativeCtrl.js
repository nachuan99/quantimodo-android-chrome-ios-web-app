angular.module('starter')

    // Controls the Negative Factors page
    .controller('NegativeCtrl', function($scope,localStorageService, $ionicModal, $timeout, measurementService, 
                                         $ionicLoading, $ionicPopup, $state, correlationService, $rootScope,
                                         utilsService, authService) {

        /*// redirect if not logged in
        if(!$scope.isLoggedIn){
            $state.go(config.appSettings.welcomeState);
            // app wide signal to sibling controllers that the state has changed
            $rootScope.$broadcast('transition');
        }*/
        
        localStorageService.getItem('notShowConfirmationNegative',function(notShowConfirmationNegative){
            $scope.notShowConfirmationNegative = notShowConfirmationNegative ? JSON.parse(notShowConfirmationNegative) : false;
        });
        
        localStorageService.getItem('notShowConfirmationNegativeDown',function(notShowConfirmationNegativeDown){
           $scope.notShowConfirmationNegativeDown = notShowConfirmationNegativeDown ? JSON.parse(notShowConfirmationNegativeDown) : false;
        });

        $scope.controller_name = "NegativeCtrl";

        $scope.negatives = false;
        $scope.usersNegativeFactors = false;


        $scope.init = function(){
            $scope.state.loading = true;
            utilsService.loadingStart();
            var user = authService.getUserFromLocalStorage();
            if(user){
                utilsService.loadingStart();
                correlationService.getNegativeFactors()
                    .then(function(correlationObjects){
                        $scope.negatives = correlationObjects;
                        correlationService.getUsersPositiveFactors().then(function(correlationObjects){
                            $scope.usersNegativeFactors = correlationObjects;
                        });
                        $ionicLoading.hide();
                    }, function(){
                        $ionicLoading.hide();
                        $state.go('app.login', {
                            fromUrl : window.location.href
                        });
                    });
            } else {
                $ionicLoading.hide();
                $state.go('app.login');
            }
        };

        // when downVoted
        $scope.downVote = function(factor) {

            if (!$scope.notShowConfirmationNegativeDown) {

                $ionicPopup.show({
                    title: 'Voting thumbs down indicates',
                    subTitle: 'you disagree that ' + factor.cause + ' decreases your ' + factor.effect + '.',
                    scope: $scope,
                    template: '<label><input type="checkbox" ng-model="$parent.notShowConfirmationNegativeDown" class="show-again-checkbox">Don\'t show this again</label>',
                    buttons: [
                        {text: 'Cancel'},
                        {text: 'Disagree',
                            type: 'button-positive',
                            onTap: function () {
                                localStorageService.setItem('notShowConfirmationNegativeDown',$scope.notShowConfirmationNegativeDown);
                                downVote(factor);
                            }
                        }
                    ]

                });
            }else{
                downVote(factor);
            }
        };

        function downVote(factor){

        	var prevValue = factor.userVote;
            factor.userVote = 0;
            
            // get params
            var cause = factor.cause;
            var effect = factor.effect;
            var vote = 0;
            var correlationCoefficient = factor.correlationCoefficient;

            // call service method for voting
            if($scope.isLoggedIn){
                correlationService.vote(vote, cause, effect, correlationCoefficient)
                    .then(function(){
                        utilsService.showAlert('Downvoted!');
                    }, function(){
                        factor.userVote = prevValue;
                        utilsService.showAlert('Downvote Failed!');
                        
                    });
            } else {
                factor.userVote = prevValue;
            	$state.go(config.appSettings.welcomeState);
            	}
        }

        // when upVoted
        $scope.upVote = function(factor){
            if(!$scope.notShowConfirmationNegative){
                $ionicPopup.show({
                    title:'Voting thumbs up indicates',
                    subTitle: 'you agree that '+factor.cause+' decreases your '+factor.effect+'.',
                    scope:$scope,
                    template:'<label><input type="checkbox" ng-model="$parent.notShowConfirmationNegative" class="show-again-checkbox">Don\'t show this again</label>',
                    buttons:[
                        {text: 'Cancel'},
                        {text: 'Agree',
                            type: 'button-positive',
                            onTap: function(){
                                localStorageService.setItem('notShowConfirmationNegative',$scope.notShowConfirmationNegative);
                                upVote(factor);
                            }
                        }
                    ]

                });
            }else{
                upVote(factor);
            }

        };

        function upVote(factor){

        	var prevValue = factor.userVote;
            factor.userVote =1;
        
            // get params
            var cause = factor.cause;
            var effect = factor.effect;
            var vote = 1;
            var correlationCoefficient = factor.correlationCoefficient;

            if($scope.isLoggedIn){

                // call service method for voting
                correlationService.vote(vote, cause, effect, correlationCoefficient)
                    .then(function(){
                        utilsService.showAlert('Upvoted!');
                    }, function(){
                    	factor.userVote = prevValue;
                        utilsService.showAlert('Upvote Failed!');
                    });

            } else {
				factor.userVote = prevValue;
            	$state.go(config.appSettings.welcomeState);
            	}
        }

        // open store in inAppbrowser
        $scope.openStore = function(name){
            console.log("open store for ", name);
            
            // create link
            name = name.split(' ').join('+');
            
            // launch inAppBrowser
            window.open('http://www.amazon.com/gp/aw/s/ref=mh_283155_is_s_stripbooks?ie=UTF8&n=283155&k='+name, '_blank', 'location=no');

        };

        // call constructor
        $scope.init();
    });