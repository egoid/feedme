// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var facebookExample = angular.module('starter', ['ionic', 'ngStorage', 'ngCordova', 'gajus.swing'])

facebookExample.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

facebookExample.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
        })
        .state('feed', {
            url: '/feed',
            templateUrl: 'templates/feed.html',
            controller: 'FeedController'
        });
    $urlRouterProvider.otherwise('/login');
});
facebookExample.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location) {

    $scope.login = function() {
        $cordovaOauth.facebook("434572043406554", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $location.path("/profile");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };

});

facebookExample.controller("ProfileController", function($scope, $http, $localStorage, $location) {

    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };

});

facebookExample.controller("FeedController", function($scope, $http, $localStorage, $location) {
    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me/feed", { params: { access_token: $localStorage.accessToken, format: "json" }}).then(function(result) {
                $scope.feedData = result.data.data;
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "picture", format: "json" }}).then(function(result) {
                    $scope.feedData.myPicture = result.data.picture.data.url;
                })
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    }
    $scope.cards = [
        {name: 'clubs', symbol: '♣'},
        {name: 'diamonds', symbol: '♦'},
        {name: 'hearts', symbol: '♥'},
        {name: 'spades', symbol: '♠'}
    ];
    $scope.throwout = function (eventName, eventObject) {
        console.log('throwout', eventObject);
    };

    $scope.throwoutleft = function (eventName, eventObject) {
        console.log('throwoutleft', eventObject);
    };

    $scope.throwoutright = function (eventName, eventObject) {
        console.log('throwoutright', eventObject);
    };

    $scope.throwin = function (eventName, eventObject) {
        console.log('throwin', eventObject);
    };

    $scope.dragstart = function (eventName, eventObject) {
        console.log('dragstart', eventObject);
    };

    $scope.dragmove = function (eventName, eventObject) {
        console.log('dragmove', eventObject);
    };

    $scope.dragend = function (eventName, eventObject) {
        console.log('dragend', eventObject);
    };

    $scope.options = {
        throwOutConfidence: function (offset, elementWidth) {
            console.log('throwOutConfidence', offset, elementWidth);
            return Math.min(Math.abs(offset) / elementWidth, 1);
        },
        isThrowOut: function (offset, elementWidth, throwOutConfidence) {
            console.log('isThrowOut', offset, elementWidth, throwOutConfidence);
            return throwOutConfidence === 1;
        }
    }

});
