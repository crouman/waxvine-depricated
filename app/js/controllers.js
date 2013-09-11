'use strict';

/* Controllers */

angular.module('waxvine.controllers', []).
controller('LibraryCtrl', ['$scope', 
                           '$location',
                           'UserService',
                           'LibraryService', 
                           'angularFire',
                           function($scope, $location, UserService, LibraryService, angularFire) {
    var userEmail = UserService.getEmail();
    if(typeof userEmail === 'undefined'){
        $location.path('/login');
        return;
    }
    var userUrl = userEmail.replace('@', '_at_').replace('.', '_dot_');
    
    var ref = new Firebase('https://waxvine.firebaseio.com/users/'+userUrl);

}]).
controller('LoginCtrl', ['$scope', '$location', 'UserService', 'angularFireAuth', function($scope, $location, UserService, angularFireAuth) {
    var ref = new Firebase("https://waxvine.firebaseio.com/");
    angularFireAuth.initialize(ref, {scope: $scope, name: "user"});
    
    $scope.login = function() {
        angularFireAuth.login('password', {
            email: $scope.email,
            password: $scope.password
        });
    };
    
    $scope.logout = function() {
        angularFireAuth.logout();
    };
    
    $scope.$on("angularFireAuth:login", function(evt, user) {
        UserService.login(user);
        //$location.path('/library');
    });
    
    $scope.$on("angularFireAuth:logout", function(evt) {
        console.log('user logged out.');
    });
    
    $scope.$on("angularFireAuth:error", function(evt, err) {
        console.log('error with user authentication');
    });
}]);