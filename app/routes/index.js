'use strict';
var path = process.cwd();
var body = require('body-parser');
var urlencoded = body.urlencoded({extended :false});
var mongo = require("mongodb").MongoClient;
var urldb= 'mongodb://rd:123@ds111589.mlab.com:11589/bar';
var https = require('https');
module.exports = function(app,passport){
//Hàm kiểm tra đăng nhập
function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
     return next();
   }else{
     res.redirect('/login');
   }

  }
//lấy dữ liệu từ key location và đưa data vào database
app.post('/bar',urlencoded,function(req,res){
  var  arr= req.body;
  var arr1 =[], location;
  for(var xkey in arr){
    if(arr[xkey]==='') arr1.push(xkey) ; break;
  }
  location = JSON.parse(arr1[0]).location;
  console.log(location);
  if(req.isAuthenticated()){
    mongo.connect(urldb,function(err,db){
      var collection5 = db.collection('users');
      collection5.update({'id' : req.user.facebook.id},function(err,user){
        user.facebook.history= location;
      });
      db.close();
    });
  }

  var going=[];
  var api = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'&type=bar&key=AIzaSyCJ3eOkxCa25iQq9BC34xEtZzhuNrxAFFc';
  https.get(api, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          mongo.connect(urldb,function(err,db){
          var collection= db.collection('bar');
          collection.findOne({'location': location},function(err,doc){
        if(doc===null){
              var newBar= function(db,callbacks){
                var data = JSON.parse(body);
                 var results = [];
                  data.results.forEach(function(place) {
                                results.push({
                                    location: location,
                                    going: going,
                                    id: place.place_id,
                                    address: place.formatted_address,
                                    name: place.name,
                                    count: 0,
                                    status: place.opening_hours !== undefined? place.opening_hours.open_now: false,
                                   photo: place.photos !== undefined? place.photos[0].photo_reference: ''
                                });
                            });
              var n=10;
              if(results.length>10) n=10;
              else n= parseInt(results.length);
              for(var i=0;i<n;i++){
                collection.insert(results[i]);
              }


              }
              newBar(db,function(){
                db.close();
              });
              }




            });


          });


      });
  }).on('error', function(e){
        console.log("Got an error: ", e);

  });
  //Update count trong database
  app.post('/barid',urlencoded,function(req,res){
     var count=0;
     var  arr2= req.body;
     console.log(arr2);
     var arr3 =[], bar, bar1, arr4=[];
     for(var xkey in arr2){
       if(arr2[xkey]==='') arr3.push(xkey) ; break;
     }

       bar = JSON.parse(arr3[0]).bar;
       var fb = JSON.parse(arr3[0]).fbId;
      console.log(bar);
   mongo.connect(urldb,function(err,db){
     var collection3 = db.collection('bar');
     collection3.find({"id": bar}).toArray(function(err,doc){
         count = Number(doc!==null?doc[0].count : 0);
         var goin = [];
         var bol = 0;
         if(doc[0].going.length===0) goin.push(fb);
         else{
            for(var i=0;i<doc[0].going.length;i++){
              if(doc[0].going[i]===fb) {
                bol =1;
                doc[0].going.splice(i,1);
                goin = doc[0].going;
               break;
             }
            }
            if(bol===0){
              goin.push(fb);
              for(var n =0;n<doc[0].going.length;n++){
                goin.push(doc[0].going[n]);
              }
            }


         }
         mongo.connect(urldb,function(err,db1){
           var collection4 = db1.collection('bar');
            collection4.update({"id": bar}, {$set:{'count': (bol===1)? count : ++count, 'going': goin }},function(){
             console.log(count);
           });
         });

     });

    db.close();
   });



  });
  app.get('/api/place/:location',function(req,res){
   var loc = req.params.location;
   mongo.connect(urldb, function(err,db){
    var collection1=db.collection('bar');
     collection1.find({'location':loc}).toArray(function(err,doc){
       var arr5 =[];
       for(var m = doc.length-1;m>=0;m--){
         arr5.push(doc[m]);
       }

       res.send(arr5);

     });

   db.close();
   });

  });
});

//logout
app.route('/logout')
  .get(function (req, res) {
    req.logout();
    res.redirect('/login');
  });
//login
app.get('/',function(req,res){
  if(isLoggedIn) res.redirect('/index');
  else res.redirect('/login');
});
//route đến index
app.get('/index',isLoggedIn,function(req,res){
  res.redirect('/index/'+req.user.facebook.id);
});
app.get('/index/:id',isLoggedIn,function(req,res){
  res.sendFile(path+'/public/index.html');
});
//login
app.get('/login',function(req,res){
  res.sendFile(path+'/public/login.html');
});
// return bar by ID
app.get('/api/bar/:id', isLoggedIn, function(req,res){
var id = req.params.id;
mongo.connect(urldb,function(err,db){
  var collection2 = db.collection('bar');
  collection2.find({'id':id}).toArray(function(err,doc){
    res.send(doc);
  });
});

});

app.get('/api/:id',isLoggedIn,function(req,res){
  	res.json(req.user.facebook);
});


app.route('/auth/facebook')
  .get(passport.authenticate('facebook'));

app.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));



}
