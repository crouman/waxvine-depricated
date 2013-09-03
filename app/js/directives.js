'use strict';

/* Directives */


angular.module('waxvine.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('tabs', [function() {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function(scope, element, attrs) {
                $("#loading").show();
                $(element).tabs();
                setTimeout(function() { // remove this before going live(only for demonstration purposes)
                    $(element).show();
                    $("#loading").hide();
                }, 3000);
            }
        };
  }]).
  directive('progressIndicator', [function(){
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function(scope, element, attrs) {
                // TODO Work on this.  Use above tabs directive example.  Find a way pass in events to trigger the indicator.
            }
        };  
  }]).
  directive('dropDown', [function() {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function(scope, element, attrs) {
                var options = scope.$eval(attrs.dropDown);
                var label = $(element).children('[drop-down-label]').first();
                var menuList = $(element).children('[drop-down-menuList]').first();
                
                $(element).mouseenter(function() {
                    label.animate({
                        backgroundColor: options.backgroundColor
                    }, 250);
                }).mouseleave(function() {
                    label.animate({
                        backgroundColor: "transparent"
                    }, 250);
                    menuList.fadeOut(250);
                }).click(function() {
                    menuList.fadeIn(250)
                });
            }
        };
  }]).
  directive('searchBox', [function() {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function(scope, element, attrs) {
                var options = scope.$eval(attrs.dropDown);
                var searchBox = $(element);
                var searchInput = $(element).children('input');
    
                //SEARCH BOX BEHAVIOR				
                //highlight for the search box
                //on focus
                searchInput.focus(function() {
                    searchBox.animate({
                        backgroundColor: options.focusColor
                    }, 250).addClass("active");
                })

                //on blur				
                searchInput.blur(function() {
                    searchBox.animate({
                        backgroundColor: options.blurColor
                    }, 500).removeClass("active");
                })
            }
        };
  }]);;
