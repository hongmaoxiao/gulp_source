/* jshint node: true */

'use strict';

var gulp = require('./');
var gutil = require('gulp-util');

var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

var testFiles = 'test/*.js';
var codeFiles = ['./*.js', './lib/*.js', testFiles];

gulp.task('test', function() {
  return gulp.src(testFiles)
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('lint', function() {
  return gulp.src(codeFiles)
    .pipe(jshint({
      reporter: 'spec'
    }));
});

gulp.task('watch', function() {
  gulp.watch(codeFiles, function() {
    gulp.run('test', 'lint');
  });
});

gulp.task('default', ['lint', 'test', 'watch']);
