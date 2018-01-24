var es = require('event-stream'),
  readFile = require('./readFile'),
  dirname = require('path').dirname;

module.exports = function(path, opt) {
  var stream = es.map(readFile);

  return stream;
};

