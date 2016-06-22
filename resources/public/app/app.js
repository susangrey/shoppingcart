var app = angular.module('app', ['registration', 'login', 'ngRoute']);


app.run(function($rootScope) {
  $rootScope.toggleLoader = function(elDisable, elLoading, color) {
    if(!$(elDisable).hasClass('loaderShown')){
      $(elDisable).addClass('loaderShown disabled').attr('disabled', 'disabled');
      $(elLoading).addClass('ajax-loader'+(color?" "+color+"-loader":""));
    } else {
      $(elDisable).removeClass('loaderShown disabled ajax-loader red-loader').removeAttr('disabled');
    }
  };
});

app.directive('onFinishRender', function($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit(attr.onFinishRender);
        });
      }
    }
  };
});

app.directive('clickToEdit', function ($timeout, $sce) {

  var directive = {};

  directive.restrict = "E";

  directive.template = "<span href=\"\" ng-mouseenter=\"hover = true\" ng-mouseleave=\"hover = false\" style=\"cursor:pointer\" ng-click=\"edit()\" ng-hide=\"editing\"><span ng-show=\"model[modelField] == 0 || !!model[modelField]\">{{ model[modelField] }}</span><a ng-hide=\"model[modelField] == 0 || !!model[modelField]\" href=\"\">Edit</a></span><input type=\"{{inputType}}\" min=\"0\" class=\"form-control\" ng-blur=\"blur()\" ng-show=\"editing\" ng-model=\"model[modelField]\"/>";

  directive.scope = {
    model: "=",
    modelField: "@",
    blurFn: "&",
    inputType: "@",
    dropdown: "@"
  };

  directive.link = function(scope, element, attrs) {

    var span  = angular.element(element.context.childNodes[0]);
    var input = angular.element(element.context.childNodes[1]);

    var oldVal;
    var newVal;

    if (!!scope.model[scope.modelField]) {
      scope.displayText = scope.model[scope.modelField];
    } else {
      scope.displayText = "<a href=\"\">Edit</a>";
    }

    scope.editing = false;

    scope.edit = function() {
      scope.editing = true;
      oldVal = scope.model[scope.modelField];
      $timeout(function() {
        input.focus();
      });
    };

    span.on('mouseenter', function() {
      element.addClass("text-primary");
    });
    span.on('mouseleave', function() {
      element.removeClass("text-primary");
    });

    scope.blur = function() {
      scope.editing = false;
      scope.blurFn({
        product: scope.model
      });
    };

  }

  return directive;

  // return {
  //     restrict: 'E',
  //     scope: {
  //         value: '='
  //     },
  //     template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
  //     link: function ($scope, element, attrs) {
  //         // Let's get a reference to the input element, as we'll want to reference it.
  //         var inputElement = angular.element(element.children()[1]);

  //         // This directive should have a set class so we can style it.
  //         element.addClass('edit-in-place');

  //         // Initially, we're not editing.
  //         $scope.editing = false;

  //         // ng-click handler to activate edit-in-place
  //         $scope.edit = function () {
  //             $scope.editing = true;

  //             // We control display through a class on the directive itself. See the CSS.
  //             element.addClass('active');

  //             // And we must focus the element.
  //             // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
  //             // we have to reference the first element in the array.
  //             inputElement[0].focus();
  //         };

  //         // When we leave the input, we're done editing.
  //         inputElement.prop('onblur', function () {
  //             $scope.editing = false;
  //             element.removeClass('active');
  //         });
  //     }
  // };
});

app.directive('integer', function() {
  //from http://stackoverflow.com/questions/19036443/angularjs-how-to-allow-only-a-number-digits-and-decimal-point-to-be-typed-in
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
      if (!ngModel)
        return;

      function isValid(val) {
        if (val === "")
          return true;

        var asInt = parseInt(val, 10);
        if (asInt === NaN || asInt.toString() !== val) {
          return false;
        }

        var min = parseInt(attr.min);
        if (min !== NaN && asInt < min) {
          return false;
        }

        var max = parseInt(attr.max);
        if (max !== NaN && max < asInt) {
          return false;
        }

        return true;
      }

      var prev = scope.$eval(attr.ngModel);
      ngModel.$parsers.push(function (val) {
        // short-circuit infinite loop
        if (val === prev)
          return val;

        if (!isValid(val)) {
          ngModel.$setViewValue(prev);
          ngModel.$render();
          return prev;
        }

        prev = val;
        return val;
      });
    }
  };
});

app.directive('capitalize', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl){
      var capitalize = function(inputValue){
        var capitalized = inputValue?inputValue.toUpperCase():inputValue;
        if(capitalized !== inputValue){
          modelCtrl.$setViewValue(capitalized);
          modelCtrl.$render();
        }
        return capitalized;
      }
      modelCtrl.$parsers.push(capitalize);
      capitalize(scope[attrs.ngModel]);
    }
  };
});

app.filter('monthDayYearFormat',function(){
  return function(date_string){
    try{
      if(!date_string || date_string=="-"){
        return "";
      }
      date_string = date_string.substr(0,10)
      var date = $.datepicker.parseDate( "yy-mm-dd", date_string)
      if(date){
        return $.datepicker.formatDate('mm/dd/yy', date);
      }
      return "";
    }catch(e){
      return "";
    }
  }
})

app.directive('alphabet', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var alphabetize = function(inputValue){
        var alphabetized = inputValue?inputValue.replace(/[^[A-Za-z]+/g, ''):inputValue;
        if(alphabetized !== inputValue){
          modelCtrl.$setViewValue(alphabetized);
          modelCtrl.$render();
        }
        return alphabetized;
      }
      modelCtrl.$parsers.push(alphabetize);
      alphabetize(scope[attrs.ngModel]);
    }
  };
});




app.config(['$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider){
  $routeProvider.
  // when('/assets/html/login/login.html', {templateUrl:'/assets/html/login/login.html', controller:'login_controller'}).
  when('/vendor/roles/display', {templateUrl:'/partials/vendor-view/role/manage', controller:'cpanel_vendor_roles', resolve:cpanel_vendor_roles.cpanel_vendor_roles_resolve}).
  
  when('/inventory_error_details', {templateUrl:'/partials/transaction/inventory-errors-details',
                                                  controller:'controller_inventory_error_details_staples',
                                                  resolve:transactions.controller_inventory_error_details_staples_resolve
  })

 
  //when('/forgot-password', {templateUrl:'/login/forgot-password-page', controller:''})
  ;
  return $httpProvider.interceptors.push(['$q', '$rootScope', '$location', function($q, $rootScope, $location){
    $status_execs={
      420 : function(response) {
        if (!$rootScope.timeout_message_displayed){
          $rootScope.timeout_message_displayed = true;
          bootbox.dialog({
            closeButton: false,
            message:response.data.reason.__.join(", "),
            title: "Change password to proceed",
            buttons:{
              success: {
                label: "Okay",
                className: "btn-success",
                callback: function() {
                  $rootScope.timeout_message_displayed = false;
                  window.location = '/#/preferences/manage?action=change_password&next='+encodeURIComponent($location.url())
                }
              }
            }
          });
        }

      }, 401 : function(response) {
        if ($location.path == "/" || $location.path == "") {
          localStorage.clear();
          //  window.location = "/"
          $rootScope.$broadcast("STORAGE_MODIFIED",null);

        }
        else if(response.config.url != "/sso/login" && response.config.url != "/service/login"  && !$rootScope.timeout_message_shown){
          $rootScope.timeout_message_shown = true;
          bootbox.dialog({
            closeButton: false,
            message:response.data.reason.__.join(", "),
            title: "Session Timeout",
            className: "login-bootbox",
            buttons:{
              success: {
                label: "Okay",
                className: "btn-success",
                callback: function() {
                  localStorage.clear();
                  window.location = "/#"
                  $rootScope.$broadcast("STORAGE_MODIFIED",null);
                  $rootScope.timeout_message_shown = false;
                }
              }
            }
          });
        }

      }
    }

    return {
      request: function(config) {
        if(config.url != "/service/login" && config.url != "/service/signup"){
          try{
            config.headers["X-Auth-Token"] = localStorage.getItem('auth_token');
            config.headers["X-Access-Token"] = JSON.parse(localStorage.getItem('active_access')).id
          } catch(e) {
            config.headers["X-Auth-Token"] = null;
            config.headers["X-Access-Token"] = null
          }
        }
        if(config && config.method == 'GET' && config.url && config.url.indexOf("partials/")==-1){
          config.params = config.params || {}
          config.params.xt = Math.random();
        }
        return config || $q.when(config);
      },
      responseError: function(response) {
        if($status_execs[response.status]){
          $status_execs[response.status](response)
        }
        return $q.reject(response);
      }
    }
  }])
}]);

app.controller('main_controller', ['$scope', '$window', 'auth_service', 'logger_service', '$rootScope', '$route', function ($scope, $window, auth_service, logger_service, $rootScope, $route) {

 function show_alert(msg) {
	var str = '<div style = "display:none" class = "alert-box" id = "alert-box">'+
	'<span>'+msg+
	'</span><br><br>'+
	'<button id="alert_ok_btn">OK</button>' +
'</div>';
      $("body").append("<div id='alert-box-container'></div>");
    	$("#alert-box-container").html(str);
	$(".alert-box").css({"z-index" : "4000",
    "border" : "solid thin rgb(207, 207, 207)",
		"width" : "600px",
		"position" : "fixed",
		"left" : "50%",
		"top" : "10%",
		"margin-left" : "-300px",
		"padding" : "20px 0px",
		"text-align" : "center",
		"background-color" : "white"});
	$(".alert-box span").css({"margin" : "0 20px 20px 20px",
		"display" : "inline-block",
		"font-family" : "arial",
		"font-size" : "15px",
		"line-height" : "21px"});
	$(".alert-box button").css({"width" : "90px",
		"height" : "30px",
		"background-color" : "#87B15E",
    "color" : "white",
		"border" : "solid thin #4cae4c"});
	$("body .alert-box").fadeIn();

}
$(document).ready(function(){
	$("#alert_ok_btn").click(function(){
		$(".alert-box").fadeOut();
    setTimeout(function(){ $("#alert-box-container").remove(); }, 3000);
	});
});


 var isBrowserCompatible = function(){
    if (( navigator.userAgent.indexOf("Chrome") !=-1 ) && ( navigator.appName == "Netscape" ) && (navigator.appCodeName == "Mozilla"))
    {
      //alert("hello chrome");
    }
    /*else if(( navigator.userAgent.indexOf("MSIE") !=-1 ) && ( navigator.appName == "Microsoft Internet Explorer" )&& (navigator.appCodeName == "Mozilla"))
    {
      //alert("hello MSIE");
    }*/
    else if(( navigator.userAgent.indexOf("Firefox") !=-1 ) && ( navigator.appName == "Netscape" )&& (navigator.appCodeName == "Mozilla"))
    {
      //alert("hello Mozilla");
    }
    else if(( navigator.userAgent.indexOf("Safari") !=-1) && ( navigator.appName == "Netscape" )&& (navigator.appCodeName == "Mozilla"))
    {
      //alert("hello Safari");
    }
    else{
      show_alert("<strong style='color:rgb(204, 0, 0)'>Warning!</strong> Staples Exchange users with unsupported browsers may find that some features do not function, or that the application doesn’t load. Staples Exchange supports <a style='color:#6F81E0' href =  \"https://support.google.com/chrome/answer/95346?hl=en\">Chrome</a>, <a style='color:#6F81E0' href =  \"https://www.mozilla.org/en-US/firefox/new/\">Firefox</a> and <a style='color:#6F81E0' href =  \"https://support.apple.com/downloads/?locale=en_US#safari\">Safari</a>.");
    }
}
 isBrowserCompatible();
  $scope.access_list = auth_service.access_list();
  $scope.active_access = auth_service.get_active_access();
  $rootScope.currency_symbol_map = {'USD':'$'}
  $rootScope.$on('STORAGE_MODIFIED', function(event, message){
    $scope.access_list = auth_service.access_list();
    $scope.active_access = auth_service.get_active_access();
    if(!$scope.$$phase && !$scope.$root.$$phase){
      $scope.$apply();
    }
  })
  $rootScope.reloadPage = function (){
    $route.reload()
  }
  $scope.should_show_login_overlay = function(){
    return  !auth_service.is_logged_in();
  }
  $scope.should_show_noaccess_overlay = function(){
    return auth_service.is_logged_in() &&
      auth_service.has_no_access();
  }
  $scope.should_show_noaccount_overlay = function(){
    return auth_service.is_logged_in() &&
      auth_service.has_multiple_access() &&
      !auth_service.get_active_access();
  }

  $scope.should_show_access_overlay = function(){
    return auth_service.is_logged_in() &&
      auth_service.has_multiple_access() &&
      !auth_service.get_active_access();;
  }
  $scope.start_listening_to_storage = function(){
    $window.addEventListener('storage', function(){
      $scope.$apply();
    });
    logger_service.load_log();   // REPLACED WITH:
    auth_service.verify_sso_token();  // NEED THIS FOR sso??!
  }
  $scope.set_active_access = function(acc){
	  auth_service.set_active_access(acc);
  }
  $scope.logout_action = function(){
	  auth_service.logout();
  }

  $rootScope.openFirstPage = function(active_access) {

  }

  $rootScope.storeUser = function (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  $rootScope.createAppSession = function(data, status, headers, config){

    console.log("CREATING APP SESSION");

	  console.log ("Token verified");
	  localStorage.setItem("auth_token", headers("X-Auth-Token"));
	  localStorage.setItem("access", JSON.stringify(data.data.access));
    $rootScope.storeUser(data.data.user);
	  console.log("Local storage set");

     var user_created_on = JSON.parse(localStorage.getItem("user")).timeinsecs;
     var d = new Date();
     var diff = d.getTime() - user_created_on;
    if(diff < 1200000){
       localStorage.setItem("show_content_mgmt",false);
    }
     else{
       localStorage.setItem("show_content_mgmt",true);
     }

     if(data.data.access && Object.keys(data.data.access).length == 1) {
		  var active_access = data.data.access[Object.keys(data.data.access)[0]];
		  localStorage.setItem("active_access", JSON.stringify(active_access));
		  if (active_access.type == 'V' && !active_access.vendor_setup_completed_on) {

        if(!active_access.vendor_setup_started_on) {

  			  if(window.location.href.indexOf("/#/documents/signers") == -1) {
            window.location = "/#/documents/signers"
		  	  }
        } else {
			  if(window.location.href.indexOf("/#/vendor/setup") == -1) {
				  window.location = "/#/vendor/setup"
			  }
        }

		  } else if (active_access.type == 'V') {

			  if(window.location.href.indexOf("/#/transactions/dashboard") == -1) {
				  window.location = "/#/transactions/dashboard"
			  }

		  } else if (active_access.type == 'S' && active_access.permission_list.indexOf("S_ORDER_SHIPMENTS_AND_INVOICES".toLowerCase()) > -1) {

			  if(window.location.href.indexOf("/#/transactions/dashboard") == -1) {
          window.location = "/#/transactions/dashboard-csr";
          window.location.reload(true);
			  }

		  } else {

			  if(data.data.user.role.description.toLowerCase().indexOf("vp") != -1) {
				  window.location = "/#/transactions/dashboard-vp"
			  } else if(window.location.href.indexOf("/#/vendor/dashboard") == -1) {
				  window.location = "/#/vendor/dashboard"
			  }

		  }

		  location.reload();

	  }

    console.log("window.location set.. content loading")
    $rootScope.$broadcast("STORAGE_MODIFIED", null)

  }

  $scope.partial_loader = false
  $rootScope.$on("$routeChangeStart", function (event, current, previous, rejection) {
    $scope.partial_loader = true
  });
  $rootScope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
    $scope.partial_loader = false
  });
  $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
    $scope.partial_loader = false
  });
  $("#action-dropdown").change(function() {
    window.location = "www.google.com"
  });
}]);
