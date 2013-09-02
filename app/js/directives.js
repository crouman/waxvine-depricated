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
                $(element).tabs();
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
