'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('waxvine.services', []).
value('version', '0.1').
factory('UserService', ['$rootScope','$http', 'angularFireAuth', function($rootScope, $http, angularFireAuth) {
    var ref = new Firebase("https://waxvine.firebaseio.com/");
    angularFireAuth.initialize(ref, {scope: $rootScope, name: "user"});
    
    var _user = new Object();
    
    return {
        login : function(email, password) {
            angularFireAuth.login('password', {
                email: email,
                password: password
            });
        },
        logout : function() {
            angularFireAuth.logout();
        },
        loginEvent : function(evt, user) {
            _user = user;
        },
        logoutEvent : function(evt) {
            console.log('user logged out.');
        },
        authError : function(evt, err) {
            console.log('error with user authentication');
        },
        getUserId : function() {
            return _user.email;
        }
    }
}]).
factory('LibraryService', function($http) {

});
