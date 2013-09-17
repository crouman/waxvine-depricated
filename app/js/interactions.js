$(function() {
    
	//toggle sign-in/-up forms
	$("#link-sign-up").click(function(){
		$("#sign-in").hide(250);
		$("#sign-up").show(250);	
	})
					
	$("#link-sign-in").click(function(){
		$("#sign-in").show(250);
		$("#sign-up").hide(250);	
	})
})