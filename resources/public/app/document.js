/*
 * Use the module factory API to register a service
 * The service factory function gen the single obj or func that represents the service to the rest of the application
 * */
var app = angular.module('myApp', ['']);

/*vpa.factory('vpaService', function ($http, $q, $routeparam){
	var vpaServiceInstance = {
			get_info:function(){
				var info=$http({
					url:'/vpa/renewal/info',
					method:'GET'
				}).then (function (response){
					return response.data;
				})
			},
	};
	return vpaServiceInstance;
});
*/


//app.controller('VPARenewalController', ['$scope', '$route', '$routeParams', '$http', 'vpaService', function($scope, vpaService, $route, $routeParams, $http) {
app.controller('VPARenewalController', function($scope) { 
	$scope.info = function(){
		console.log("hi");
		noty({text:"<strong>That was easy.....<strong>", type:"information", layout:"top", timeout:6000})
		return "hello";
		/*var n = noty({text:"Please wait.....", type:"information", layout:"top", timeout:6000})
		vpaService.get_info().then(function(data){
			n.close()
			noty({text:"<strong>That was easy.....<strong>", type:"information", layout:"top", timeout:6000})
		})*/
	}
   
});