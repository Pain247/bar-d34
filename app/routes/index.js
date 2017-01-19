'use strict';
var path = process.cwd();
module.exports = function(app,passport){
function isLoggedIn(req,res,next){
 if(req.isAuthenticated()){
   return next();
 }else{
   res.redirect('/login');
 }

}
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
  res.sendFile(path+'/public/index.html');
});
//login
app.get('/login',function(req,res){
  res.sendFile(path+'/public/login.html');
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
