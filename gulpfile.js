'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
 
gulp.task('sass', function () {
  return gulp.src('./markup/scss/all.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./production/css'));
});
 

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', () =>
	gulp.src('markup/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('production/images'))
);

var gulp     = require('gulp'),
    process  = require('gulp-stylus'),
    prefix   = require('gulp-autoprefixer'),
    compress = require('gulp-minify-css'),
    gulpif   = require('gulp-if'),
    rename   = require('gulp-rename'),
    notifier = require('../helpers/notifier'),
    config   = require('../config').css;

/* Таск от фонаря от July */

gulp.task('css', function(cb) {

  var queue = config.bundles.length;

  var buildThis = function(bundle) {

    var build = function() {
      return (
          gulp.src(bundle.src)
              .pipe(process(config.params))
              .pipe(prefix(config.autoprefixer))
              .pipe(gulpif(bundle.compress, compress(config.compress)))
              .pipe(gulpif(bundle.compress, rename({suffix: '.min'})))
              .pipe(gulp.dest(bundle.destPublicDir))
              .on('end', handleQueue)
      );
    };

    var handleQueue = function() {
      notifier(bundle.destFile);
      if (queue) {
        queue--;
        if (queue === 0) cb();
      }
    };

    return build();
  };

  config.bundles.forEach(buildThis);

});
