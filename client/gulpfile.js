'use strict';

var browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber');

function errorHandler(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
}


gulp.task('browserify', function () {
    var b = browserify({
        entries: './source/main.js',
        debug: true
    });

    return b
        .bundle()
        .on('error', function(error){
            // Output an error message
            gutil.log('Browserify error:');
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        })
        .pipe(plumber({errorHandler:errorHandler}))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true,
            debug: true
        }))
        // Add transformation tasks to the pipeline here.
//         .pipe(uglify())
//         .on('error', gutil.log)
        .pipe(sourcemaps.write('./', {
            debug: true
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.watch('./source/**/*.js', ['browserify']);

gulp.task('sass', function () {
    gulp.src('./styles/*.scss')
        .pipe(plumber({errorHandler:errorHandler}))
        .pipe(sourcemaps.init())
        .pipe(concat('style.scss'))
        .pipe(sass())
        .pipe(sourcemaps.write('./', {
            debug: true
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.watch('./styles/*.scss', ['sass']);

gulp.task('default', ['browserify', 'sass']);
