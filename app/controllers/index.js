var app = angular.module('myApp',['ngSanitize']);
app.controller('ctrl',['$scope','$http','$location',function($scope,$http,$location){
  var arr =[];
  var d=[];
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
   $scope.post= function(){
     var location = angular.lowercase($scope.loc);
    $scope.value= true;
    $scope.noti = true;
    var data = {location : location};
    $http({
     method  : 'POST',
     url     : window.location.origin+'/bar',
     data    : data
    });
    $http.get(window.location.origin+'/api/place/'+location)
           .success(function(res) {

             var link1 = $location.absUrl().split('/');
             var fbId1 = link1[link1.length-1];
            var response = angular.fromJson(res);
            if(response.length===0){
             noti = false;
            }
            else {
              noti = true;
              var heart = false;
            response.forEach(function(item){
              for(var j=0;j<item.going.length;j++){
                if(item.going[j]===fbId1) heart = true;
              }
              d.push({
                id: item.id,
                name: item.name,
                address: item.address,
                status: item.status,
                going: item.going,
                count: item.count,
                heart: heart,
                photo: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+item.photo+"&key=AIzaSyCJ3eOkxCa25iQq9BC34xEtZzhuNrxAFFc"
              });
              heart=false;
            });
           $scope.data =d;
           $scope.value= false;
           d=[];
  }});

  }
 $scope.going = function(bar){
   var link = $location.absUrl().split('/');
   var fbId = link[link.length-1];
   var barId = { bar : bar.id, fbId : fbId};
    if(bar.heart===false){
    bar.count++;
    bar.heart = true;
    $http({
    method  : 'POST',
    url     : window.location.origin+'/barid',
    data    : barId
  });
}
else{
  bar.count--;
  bar.heart=false;
  $http({
  method  : 'POST',
  url     : window.location.origin+'/barid',
  data    : barId
});
}
}


}]);
