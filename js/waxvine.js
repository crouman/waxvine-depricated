jQuery(function($) {"use strict";

	var Utils = {
		// https://gist.github.com/1308368
		uuid : function(a, b) {
			for( b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
			return b
		},
	};
	
	var ALL_COMPONENTS = [];

	var App = {
		// ************* Initialization ************* //
		init : function() {
			this.createComponentList();
			this.createLibrariesMenu();
			this.cacheElements();
			this.initPlugins();
			this.bindEvents();
			localStorage.setItem('Library Name','{"name":"Library Name","components":'+JSON.stringify(ALL_COMPONENTS)+'}');
			this.$libraryName.data('previous-value', 'Library Name');
			if(localStorage.getItem('current-library') !== null)
				this.loadLibraryComponents(localStorage.getItem('current-library'), true);
			else
				this.loadLibraryComponents(this.getUser().libraries[0], true);
		},
		cacheElements : function() {			
			this.$category = $('.category');
			this.$librariesLabel = $('#libraries-label');
			this.$librariesDropDown = $('#libraries-dropdown');
			this.$librariesMenu = $('#libraries-menu');
			this.$librariesMenuHeader = $('.menu-header');
			this.$newLibrary = $('#new-library');
			this.$library = $('li[library]');
			this.$componentWrapper = $('.sub-menu li');
			this.$component = $('a[component]');
			this.$componentName = $('#component-name');
			this.$content = $('#content');
			this.$overviewTab = $('li[tab="overview"]');
			this.$tabs = $('li[tab]');
			this.$article = $('article[component]');
			this.$articleOverview = $('article[tab=overview]');
			this.$settings = $('#settings');
			this.$settingsIcon = $('#settings-icon');
			this.$settingsDropDown = $('#settings-dropdown');
			this.$editLibrary = $('#edit-library');
			this.$cloneLibrary = $('#clone-library');
			this.$deleteLibrary = $('#delete-library');
			this.$libraryName = $('#library-name h1');
			this.$errorMessage = $('#error-message');
			this.$componentCheckBox = $('.checkbox');
			this.$editLibraryControls = $('#edit-library-controls');
			this.$editLibrarySave = $('#library-save');
			this.$editLibraryCancel = $('#library-cancel');
			this.$checked = $('.checked');
			this.$unChecked = $('.unchecked');
			this.$removeAddProcessing = $('#content-container #toolbar .processing');
			this.$addLink = $('#add-link');
			this.$removeLink = $('#remove-link');
		},
		initPlugins : function(){
			
		},
		bindEvents : function() {
			this.$componentWrapper.on( 'click', this.loadComponentOnClick );
			this.$librariesLabel.on( 'hover', this.onLibrariesHover );
			this.$librariesDropDown.on( 'mouseleave', this.onLibrariesLeave );
			this.$library.on( 'click', this.loadLibraryOnClick );
			this.$newLibrary.on( 'click', this.createNewLibrary );
			this.$tabs.on( 'click', this.loadContent );
			this.$settingsIcon.on( 'hover', this.onSettingsHover );
			this.$settingsIcon.on( 'mouseleave', this.onSettingsIconLeave );
			this.$settingsDropDown.on( 'mouseleave', this.onSettingsLeave );
			this.$editLibrary.on( 'click', this.editLibrary );
			this.$cloneLibrary.on( 'click', this.cloneLibrary );
			this.$deleteLibrary.on ( 'click', this.deleteLibrary );
			this.$editLibrarySave.on( 'click', this.saveLibrary );
			this.$editLibraryCancel.on( 'click', this.cancelEdit );
			this.$checked.on( 'click', this.markRemoveFromLibrary );
			this.$unChecked.on( 'click', this.markAddToLibrary );
			this.$libraryName.on( 'keypress', function(e){ return e.which != 13; });
			this.$addLink.on( 'click', this.addComponentToLibrary );
			this.$removeLink.on( 'click', this.removeComponmentFromLibrary );
		},
		createLibrariesMenu : function(){
			var libraries = App.getUser().libraries;
			
			$('li[library]').remove();
			jQuery.each(libraries, function(index){
				if(libraries[index] !== 'Library Name'){
					$('.menu-header').after("<li library='"+libraries[index]+"'>"+libraries[index]+"</li>");
					$('li[library="'+libraries[index]+'"]').on( 'click', App.loadLibraryOnClick );
				}
			})
		},
		loadLibraryOnClick : function(){
			localStorage.setItem('current-library', $(this).attr('library'));
			App.loadLibraryComponents($(this).attr('library'), true);
			App.$librariesDropDown.hide();
		},
		createNewLibrary : function(){
			App.loadLibraryComponents('Library Name', true);
			App.editLibrary();
		},
		// Creates component list using Handlebar template
		createComponentList : function(){
			var template = Handlebars.compile($('#component-list-template').html());
			$.ajax({
			    type: 'GET',
			    url: 'components/component-list.json',
			    dataType: 'json',
			    success: function(json) { 
			    	$('#component-list').html(template(json));
		    		jQuery.each(json.category, function(){
		    			jQuery.each($(this)[0].component, function(){
		    				ALL_COMPONENTS.push($(this).attr('component-name'));
		    			});
		    		});
			    },
			    data: {},
			    async: false
			});
		},
		getUser : function(){
			if(localStorage.getItem("user") === null){
				localStorage.user = '{"name":"Awesome User","libraries":["Library Name"]}';
			}
			
			// TODO load user from session
		
			return jQuery.parseJSON(localStorage.user);
		},
		loadLibraryComponents : function(libraryName, goToFirstComponent){
			var user = App.getUser();
			var library = jQuery.parseJSON(localStorage.getItem(libraryName));
			App.$category.hide();
			App.$component.hide();
			App.$libraryName.html(library.name);
			App.$checked.hide();
			App.$unChecked.show();
			for(var i=0; i < library.components.length; i++){
				var $component = $('a[component='+library.components[i]+']');
				$component.show();
				var $checkbox = $component.prev('.checkbox')
				$checkbox.find('.checked').show();
				$checkbox.find('.unchecked').hide();
				$checkbox.parent().parent().prev('.category').show();
			}
			if(goToFirstComponent){
				var $firstComponent = $('a[component='+library.components[0]+']');
				App.$componentWrapper.removeClass('active');
				$firstComponent.parent().addClass('active');
				App.loadComponent($firstComponent.html(),$firstComponent.attr('component'));
			}
			if(libraryName === 'Library Name'){
				App.$removeLink.hide();
				App.$addLink.hide();
			}else if(goToFirstComponent){
				App.$removeLink.show();
				App.$addLink.hide();
			}
		},
		// Handles click events for component
  		// Loads appropriate html page for which component is clicked on
		loadComponentOnClick : function(){
			if(App.$libraryName.html() !== 'Library Name'){
				if($(this).find('.unchecked').is(':visible')){
					App.$removeLink.hide();
					App.$addLink.show();
				}else{
					App.$addLink.hide();
					App.$removeLink.show();
				}
			}
			App.$componentWrapper.removeClass('active');
			$(this).addClass('active');
			var $anchor = $(this).find('a[component]');
			App.loadComponent($anchor.html(), $anchor.attr('component'));
		},
		loadComponent : function(name, component){
			App.$componentName.html(name);
			App.$componentName.data('component', component);
			App.$content.load('components/'+component+'.html', function(response, status, xhr) {
				if (status == "error") {
			    	App.$content.html('Uh-oh...There was an issue with retrieving contents for this component.  Please email <a href="mailto:support@waxvine.com">support@waxvine.com</a>, state which component it is and tell them get their act together!');
			  		console.log('There was an error fetching the contents for that component.  Are you sure the component content markup exist and the component-name matches file name?')
			  	}
			});
			App.$tabs.removeClass('selected');
			App.$overviewTab.addClass('selected');
		},
		// Handles click events for tabs
		// hide/show the appropriate tab contents
		loadContent : function(){
			$('article[component]').hide();
		 	$('article[tab="'+$(this).attr('tab')+'"]').show();
			App.$tabs.removeClass('selected');
			$(this).addClass('selected');
		},
		onLibrariesHover : function(){
			App.$librariesLabel.addClass('libraries-hover');
			App.$librariesDropDown.show();
		},
		onLibrariesLeave : function(){
			App.$librariesLabel.removeClass('libraries-hover');
			$(this).hide();
		},
		onSettingsHover : function(){
			App.$settings.addClass('settings-hover');
			App.$settingsDropDown.show();
		},
		onSettingsIconLeave : function(){
			setTimeout(function(){
				if($('#settings-menu li:hover').length === 0 && $('#settings-icon:hover') !== 0){
					App.$settings.removeClass('settings-hover');
					App.$settingsDropDown.hide();
				}
			},1000);
		},
		onSettingsLeave : function(){
			App.$settings.removeClass('settings-hover');
			$(this).hide();
		},
		editLibrary : function(){
			App.$libraryName.data('previous-value', App.$libraryName.html());
			App.$libraryName.attr('contenteditable', 'true').addClass('edit-border');
			App.$category.show();
			App.$component.show();
			App.$componentCheckBox.css('display','inline-block');
			App.$settingsIcon.hide();
			App.$settingsDropDown.hide();
			App.$editLibraryControls.show();
			App.$addLink.hide();
			App.$removeLink.show();
		},
		cloneLibrary : function(){
			App.$libraryName.html(App.$libraryName.html()+'-clone');
			App.editLibrary();
		},
		deleteLibrary : function(){
			var r=confirm("Are you sure you want to delete this library?")
			if (r==true)
			{
				if(App.$libraryName.html() == 'Library Name'){
					// TODO show validation error
				}else{
					localStorage.removeItem(App.$libraryName.html());
					var user = jQuery.parseJSON(localStorage.getItem('user'));
					var index = user.libraries.indexOf(App.$libraryName.html());
					user.libraries.splice(index, 1);
					localStorage.setItem('user', JSON.stringify(user));
					$('li[library="'+App.$libraryName.html()+'"]').remove();
					var $nextLibrary = $('li[library]').first();
					if($nextLibrary.length === 0){
						localStorage.setItem('current-library', 'Library Name');
						App.loadLibraryComponents('Library Name', true);
					}else{
						localStorage.setItem('current-library', $nextLibrary.attr('library'));
						$nextLibrary.trigger('click');
					}
				}
			}
			else
			{
			  	
			}
		},
		saveLibrary : function(){
			var previousLibraryName = App.$libraryName.data('previous-value');
			var newLibraryName = App.$libraryName.html();
			if(newLibraryName.indexOf('<br>') !== -1){// empty
				App.showLibraryNameError('Library name can not be empty.');
			}else if(newLibraryName === 'Library Name'){
				App.showLibraryNameError('Can not use "Library name" as the name of the library.');
			}else if(newLibraryName.indexOf('-clone') !== -1){
				App.showLibraryNameError('Library name can not have "-clone" in the name.');
			}else if(newLibraryName.indexOf('\'') !== -1){
				App.showLibraryNameError('Library name can not have an apostrophe in the name.');
			}else if(newLibraryName.indexOf('"') !== -1){
				App.showLibraryNameError('Library name can not have quotes in the name.');
			}else if(newLibraryName.indexOf('&lt;') !== -1){
				App.showLibraryNameError('Library name can not have "<" in the name.');
			}else if(newLibraryName.indexOf('&gt;') !== -1){
				App.showLibraryNameError('Library name can not have ">" in the name.');
			}
			else{
				var library;
				if(previousLibraryName === 'Library Name' ||
				   previousLibraryName.indexOf('-clone') !== -1){ // new library or cloned
					library = jQuery.parseJSON(localStorage.getItem(previousLibraryName.replace('-clone', '')));
					var user = jQuery.parseJSON(localStorage.getItem('user'));
					user.libraries.push(newLibraryName);
					localStorage.setItem('user', JSON.stringify(user));
				}else{ // edit existing library
					library = jQuery.parseJSON(localStorage.getItem(previousLibraryName));
					localStorage.removeItem(previousLibraryName);
					var user = jQuery.parseJSON(localStorage.getItem('user'));
					var index = user.libraries.indexOf(previousLibraryName);
					user.libraries[index] = newLibraryName;
					localStorage.setItem('user', JSON.stringify(user));
				}
				library.name = newLibraryName;				
				library.components = new Array();
				$('.checked:visible').each(function(){
					library.components.push($(this).parent().next().attr('component'));
				});
				localStorage.setItem(newLibraryName, JSON.stringify(library));
				
				App.createLibrariesMenu();
				App.toggleSettingsEditControls();
				localStorage.setItem('current-library', newLibraryName);
				App.loadLibraryComponents(newLibraryName, true);
			}
		},
		cancelEdit : function(){
			App.toggleSettingsEditControls();
			var libraryName = localStorage.getItem('current-library');
			if(libraryName === null){
				libraryName = App.$libraryName.data('previous-value');
			}
			App.loadLibraryComponents(libraryName, true);
		},
		toggleSettingsEditControls : function(){
			App.$libraryName.attr('contenteditable', 'false').removeClass('edit-border').removeClass('library-name-error');
			App.$errorMessage.html('').hide();
			App.$componentCheckBox.hide();
			App.$editLibraryControls.hide();
			App.$settingsIcon.show();
			App.$addLink.hide();
			App.$removeLink.show();
		},
		showLibraryNameError : function(errorMsg){
			App.$errorMessage.html(errorMsg).show();
			App.$libraryName.addClass('library-name-error');
		},
		markAddToLibrary : function(){
			$(this).hide();
			$(this).next('.checked').show();
			App.$addLink.hide();
			App.$removeLink.show();
		},
		markRemoveFromLibrary : function(){
			$(this).hide();
			$(this).prev('.unchecked').show();
			App.$removeLink.hide();
			App.$addLink.show();
		},
		addComponentToLibrary : function(){
			App.$addLink.html('Adding to library');
			App.$removeAddProcessing.show();
			setTimeout(function(){
				App.$addLink.hide();
				if(App.$libraryName.hasClass('edit-border')){// In edit view
					var componentName = App.$componentName.html();
					var $component = $('.sub-menu li:contains("'+componentName+'")').first();
					$component.find('.unchecked').trigger('click');
				}else{// Not in edit view
					var libraryName = App.$libraryName.html();
					var library = jQuery.parseJSON(localStorage.getItem(libraryName));
					library.components.push(App.$componentName.data('component'));
					localStorage.setItem(libraryName, JSON.stringify(library));
					App.loadLibraryComponents(libraryName, false);
				}
				App.$addLink.html('+ Add to library');
				App.$removeAddProcessing.hide();
				App.$removeLink.show();
			}, 2000);
		},
		removeComponmentFromLibrary : function(){
			App.$removeLink.html('Removing from library');
			App.$removeAddProcessing.show();			
			setTimeout(function(){
				App.$removeLink.hide();
				if(App.$libraryName.hasClass('edit-border')){// In edit view
					var $component = $('.sub-menu li:contains("'+App.$componentName.html()+'")').first();
					$component.find('.checked').trigger('click');
				}else{// Not in edit view
					var libraryName = App.$libraryName.html();
					var library = jQuery.parseJSON(localStorage.getItem(libraryName));
					library.components.splice(library.components.indexOf(App.$componentName.data('component')), 1);
					localStorage.setItem(libraryName, JSON.stringify(library));
					App.loadLibraryComponents(libraryName, false);
				}
				App.$removeLink.html('- Remove from library');
				App.$removeAddProcessing.hide();
				App.$addLink.show();
			}, 2000);
		}
	};

	window.waxvineApp = App.init();
});
