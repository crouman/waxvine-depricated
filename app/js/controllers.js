'use strict';

/* Controllers */

angular.module('waxvine.controllers', []).
controller('LibraryCtrl', ['$scope', 
                           '$location',
                           'UserService',
                           'LibraryService', 
                           'angularFire',
                           function($scope, $location, UserService, LibraryService, angularFire) {
    var userId = UserService.getUserId();
    if(typeof userId === 'undefined'){
        $location.path('/login');
        return;
    }
    var userUrl = userId.replace('@', '_at_').replace('.', '_dot_');
    
    var ref = new Firebase('https://waxvine.firebaseio.com/users/'+userUrl);
    angularFire(ref, $scope, 'user');
    
    $scope.logout = function() {
        UserService.logout();
        $location.path('/login');
    };
}]).
controller('LoginCtrl', ['$scope', '$location', 'UserService', function($scope, $location, UserService) {
    
    $scope.login = function() {
        UserService.login($scope.email, $scope.password);
    };
    
    $scope.logout = function() {
        UserService.logout();  
    };
    
    $scope.$on("angularFireAuth:login", function(evt, user) {
        UserService.loginEvent(evt, user);
        $location.path('/library');
    });
    
    $scope.$on("angularFireAuth:logout", function(evt) {
        UserService.logoutEvent(evt);
    });
    
    $scope.$on("angularFireAuth:error", function(evt, err) {
        UserService.authError(evt, err);
    });
    
    $scope.signUp = function() {
        $location.path('/signup');  
    };
}]).
controller('SignUpCtrl', ['$scope', '$location', function($scope, $location){
    
}]);