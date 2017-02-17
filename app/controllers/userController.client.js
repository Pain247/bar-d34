'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';
   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
     var info = JSON.parse(data)
     document.getElementById("dname").innerHTML="<a id='display-name' class='pull-right' href='/profile/"+info.id+"'>"+info.displayName+"&nbsp;</a>";
   }));
})();
