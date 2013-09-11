'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('waxvine.services', []).
value('version', '0.1').
factory('UserService', function($http) {
    var _user = new Object();
    
    return {
        login : function(user){
            _user = user;
        },
        getEmail : function(){
            return _user.email;
        }
    }
}).
factory('LibraryService', function($http) {

});
