var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('default', function() {
    gulp.start('sass', 'scripts')
});

// Compile Sass, minify
gulp.task('sass', function() {
   return gulp.src('app/styles/main.scss')
       .pipe(sass({ style: 'expanded' }))
       .on('error', function (err) { console.log(err.message); })
       .pipe(gulp.dest('dist/css'))
       .pipe(rename({suffix: '.min'}))
       .pipe(minifycss())
       .pipe(gulp.dest('dist/css'))
       .pipe(notify({ message: "Sass task complete" }))
});

// JSHint, concat, and minify Javascript
gulp.task('scripts', function() {
   return gulp.src('app/scripts/**/*.js')
       .pipe(jshint('.jshintrc'))
       .pipe(jshint.reporter('default'))
       .pipe(ngAnnotate({ remove:true, add:true, single_quotes:true }))
       .pipe(concat('angular-2048.js'))
       .pipe(gulp.dest('dist/js'))
       .pipe(rename({suffix: '.min'}))
       .pipe(uglify())
       .on('error', function (err) { console.log(err.message); })
       .pipe(gulp.dest('dist/js'))
       .pipe(notify({ message: "Scripts task complete" }))
});