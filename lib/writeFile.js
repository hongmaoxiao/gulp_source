var fs = require('fs');
var isStream = require('./isStream');

module.exports = function (writePath, file, cb) {
  // if no contents then do nothing
  if (typeof file.contents === 'undefined') {
    return cb(null, file);
  }

  // stream it to disk yo
  if (isStream(file.contents)) {
    var outStream = fs.createWriteStream(writePath);
    file.contents.once('end', function () {
      cb(null, file);
    });
    file.contents.pipe(outStream);
    return;
  }

  // write it like normal
  fs.writeFile(writePath, file.contents, function(err){
    if (err) return cb(err);

    // re-emit the same data we got in.
    cb(null, file);
  });
};