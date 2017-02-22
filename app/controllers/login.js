var app = angular.module('App',['ngSanitize']);
app.controller('ctrller',['$scope','$http','$location',function($scope,$http,$location){
  var arr =[];
  var d=[];

  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
   $scope.post= function(){
    $scope.value= true;
    $scope.noti = true;
    var location= angular.lowercase($scope.loc);
    var data = {location : location};
    $http({
     method  : 'POST',
     url     : window.location.origin+'/bar',
     data    : data
    });
    $http.get(window.location.origin+'/api/place/'+location)
           .success(function(res) {
            var response = angular.fromJson(res);
            console.log(response.length);
            if(response.length===0){
              noti = false;
            }
            else {
              noti= true;
              response.forEach(function(item){
              d.push({
                id: item.id,
                name: item.name,
                address: item.address,
                status: item.status,
                photo: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+item.photo+"&key=AIzaSyCJ3eOkxCa25iQq9BC34xEtZzhuNrxAFFc"
              });
            });
           $scope.data =d;
           $scope.value= false;
           d=[];
  }});
  }
}]);
