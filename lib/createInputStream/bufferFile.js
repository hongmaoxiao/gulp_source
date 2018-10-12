var fs = require('graceful-fs');

module.exports = function (file, cb) {
  fs.readFile(file.path, function (err, data) {
    if (err) {
      cb(err);
    }
    file.contents = data;
    cb(null, file);
  });
};
