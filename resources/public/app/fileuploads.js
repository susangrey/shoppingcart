var app = angular.module('myApp', ['fileUploadService', 'ngFileUpload']);

app.controller('file_upload_controller', function($scope) {
    $scope.companyname = "Susan LLC";
    $scope.insuranceamount = "3011111111";
   
});