var fs = require('fs'),
  path = require('path');
var binding;

// Look for binary for this platform
var modPath = path.join(__dirname, 'bin', process.platform + '-' + process.arch, 'nodeSSPI');
try {
  fs.statSync(modPath + '.node');
  binding = require(modPath);
} catch (ex) {
  binding = require('bindings')('nodeSSPI');
}

/*
  opts:{
    offerSSPI: true|false,
    offerBasic: true|false,
    basicPreferred: false|true,
    authoritative: true|false,
    usernameCase: 'lower'|'upper',
    perRequestAuth: true|false,
    domain: <string>, // used by basic authentication
    omitDomain: false|true,
    userHeader: <string>, // HTTP header authenticated user name is populated to
  }
*/
function main(opts) {
  // defaults
  opts.__proto__.offerSSPI = true;
  opts.__proto__.offerBasic = true;
  opts.__proto__.basicPreferred = false;
  opts.__proto__.authoritative = true;
  opts.__proto__.omitDomain = false;
  opts.__proto__.usernameCase = 'lower';
  opts.__proto__.perRequestAuth = true;

  this.opts = opts;
}

main.prototype.authenticate = function (req, res, next) {
  if (!this.opts.authoritative || req.statusCode === 200) {
    next();
  } else {
    res.end();
  }
}

module.exports = main;