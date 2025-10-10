const SamlStrategy = require('./saml-strategy'); 

module.exports = function (app, config, passport) {

    app.get('/', function (req, res) {
      if (req.isAuthenticated()) {
        res.send("Authenticated...");
      } else {
        res.send("Not Authenticated");
      }
    });
  
    app.get('/login',
      passport.authenticate(config.passport.strategy,
        {
          successRedirect: '/',
          failureRedirect: '/login'
        })
    );
  
    app.post(config.passport.saml.path,
      passport.authenticate(config.passport.strategy,
        {
          failureRedirect: '/',
          failureFlash: true
        }),
      function (req, res) {
        res.redirect('/');
      }
    );
  
    app.get('/signup', function (req, res) {
      res.send('signup');
    });
  
    app.get('/profile', function (req, res) {
      if (req.isAuthenticated()) {
        res.send("User is authenticated");
      } else {
        res.redirect('/login');
      }
    });
  
    app.get('/logout', function (req, res) {
      if (req.user == null) {
        return res.redirect('/');
      }
      return SamlStrategy.logout(req, function(err, uri) {
        return res.redirect(uri);
      // TODO: invalidate session on IP
     
    });
  
  };