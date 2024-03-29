'use strict';


// Declare app level module which depends on filters, and services
angular.module('waxvine', ['firebase', 'waxvine.filters', 'waxvine.services', 'waxvine.directives', 'waxvine.controllers']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/library', {
        templateUrl: 'partials/library.html',
        controller: 'LibraryCtrl'
    });
		$routeProvider.when('/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardCtrl'
    })
    $routeProvider.when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
    });
    $routeProvider.when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignUpCtrl'
    });
    $routeProvider.otherwise({
        redirectTo: '/library'
    });
}]);
