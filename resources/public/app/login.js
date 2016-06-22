var login = angular.module('login', []);

login.controller('login_controller', ['$scope', function($scope) {
	$scope.login_username = "";
	$scope.login_password = "";
	console.log("1");
	
	$scope.login_button_action = function(){
		console.log("2");
		alert(console.log.toString());
	}
}]);

login.controller('forgot_password_controller', ['$scope', function($scope) {
	$scope.email_address = "";
	$scope.show_forgot_password = false;
	
	console.log("Inside ctrll");
	
	$scope.forgot_password_button_action = function(){
	alert("bootbox");	
		//noty({text:"hi", type:"sucess", layout:"top", timeout:5000})
		//var email = $scope.email_address;
		
		//add a bootbox
		bootbox.dialog({
			  message: "I am a custom dialog",
			  title: "Custom title",
			  className: "login-bootbox",
			  buttons: {
			    success: {
			      label: "OK!",
			      className: "btn-success",
			      /*callback: function() {
			        Example.show("great success");
			      }*/
			    },
			    danger: {
			      label: "Danger!",
			      className: "btn-danger",
			     /* callback: function() {
			        Example.show("uh oh, look out!");
			      }*/
			    },
			    main: {
			      label: "Click ME!",
			      className: "btn-primary",
			      /*callback: function() {
			        Example.show("Primary button");
			      }*/
			    }
			  }
			});
		
	}
    
	$scope.toggle_show_forgot_password = function(){
		console.log($scope.show_forgot_password);
    	$scope.show_forgot_password? $scope.show_forgot_password = false : $scope.show_forgot_password = true;
    		
    }
    
}]);

//angular.bootstrap(document,['login']);