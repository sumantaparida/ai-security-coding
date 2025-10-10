const SamlStrategy = require('passport-saml').Strategy;
var config = require('./logout-config')['development'];

module.exports = new SamlStrategy(config.passport.saml, function (
  profile,
  done
) {
  return done(null, {
    id: profile.uid,
    email: profile.email,
    displayName: profile.cn,
    firstName: profile.givenName,
    lastName: profile.sn,
  });
});
