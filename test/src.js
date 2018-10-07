var gulp = require('../');
var should = require('should');
var join = require('path').join;
var semver = require('semver');

require('mocha');

describe('gulp input stream', function() {
  describe('src()', function() {
    it('should return a stream', function(done) {
      var stream = gulp.src(join(__dirname, "./fixtures/*.coffee"));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });
    it('should return a input stream from a flat glob', function(done) {
      var stream = gulp.src(join(__dirname, "./fixtures/*.coffee"));
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path,'').should.equal(join(__dirname, "./fixtures/test.coffee"));
        String(file.contents).should.equal("this is a test");
      });
      stream.on('end', function() {
        done();
      });
    });
    it('should return a input stream with no contents when read is false', function(done) {
      var stream = gulp.src(join(__dirname, "./fixtures/*.coffee"), {read: false});
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.not.exist(file.contents);
        join(file.path,'').should.equal(join(__dirname, "./fixtures/test.coffee"));
      });
      stream.on('end', function() {
        done();
      });
    });
    it('should return a input stream with contents as stream when buffer is false', function(done) {
      var stream = gulp.src(join(__dirname, "./fixtures/*.coffee"), {buffer: false});
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        var buf = "";
        file.contents.on('data', function(d){
          buf += d;
        });
        file.contents.on('end', function(){
          buf.should.equal("this is a test");
          done();
        });
        join(file.path,'').should.equal(join(__dirname, "./fixtures/test.coffee"));

        // 0.8 needs this
        if (semver.lt(process.versions.node, '0.9.0')) {
          file.contents.resume();
        }
      });
    });
    it('should return a input stream from a deep glob', function(done) {
      var stream = gulp.src(join(__dirname, "./fixtures/**/*.jade"));
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path,'').should.equal(join(__dirname, "./fixtures/test/run.jade"));
        String(file.contents).should.equal("test template");
      });
      stream.on('end', function() {
        done();
      });
    });
    it('should return a input stream from a deeper glob', function(done) {
      var stream = gulp.src(join(__dirname, "./fixtures/**/*.dmc"));
      var a = 0;
      stream.on('error', done);
      stream.on('data', function(file) {
        ++a;
      });
      stream.on('end', function() {
        a.should.equal(2);
        done();
      });
    });

    it('should return a file stream from a flat path', function(done) {
      var a = 0;
      var stream = gulp.src(join(__dirname, "./fixtures/test.coffee"));
      stream.on('error', done);
      stream.on('data', function(file) {
        ++a;
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path,'').should.equal(join(__dirname, "./fixtures/test.coffee"));
        String(file.contents).should.equal("this is a test");
      });
      stream.on('end', function() {
        a.should.equal(1);
        done();
      });
    });
  });
});
