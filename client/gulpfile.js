'use strict';

var browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');

gulp.task('browserify', function () {
    var b = browserify({
        entries: './source/main.js',
        debug: true
    });

    return b.bundle()
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
