$(document).ready(function(){
var arrImg=[];

$("#enter").on('click',function(){
  $(".block").hide();
  var location= $("#search").val();
  var url='https://maps.googleapis.com/maps/api/place/textsearch/json?query=bar+in+'+location+'&key=AIzaSyCJ3eOkxCa25iQq9BC34xEtZzhuNrxAFFc';
  $.ajax({
  type:"GET",
  url: url,
  async:true,
  dataType:"json",
  success: function(data){


  if(data.results.length===0){
       $("#output").prepend("<h1 class='wrong'>WRONG CITY!</h1>");
     }
  for(var j=0;j<data.results.length;j++){
    if(data.results[j].hasOwnProperty('photos')===false) img='https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png';
    else img='https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+data.results[j].photos[0].photo_reference+'&key=AIzaSyCJ3eOkxCa25iQq9BC34xEtZzhuNrxAFFc';
     arrImg.push(img);
  }


 for(var i=0;i<data.results.length;i++){
    $("#output").append("<div><div class='block'><div class='row'><div class='col-xs-1'><br/><img src="+arrImg[i]+" width=120 height=120></div><div class='col-xs-9'><br/><a><h2 class='barname'>"+data.results[i].name+"<br/></h2></a><h2 class='name'>"+data.results[i].formatted_address+"</h2></div><div class='col-xs-2'></div></div></div></div><br/>" );

}
  },
  error : function(errorMessage){
   alert("ERROR") ;
 },
});


  });

});
