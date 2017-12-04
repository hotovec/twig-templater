var gulp = require('gulp'),
    sass = require('gulp-sass'),
    webpack = require('webpack-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// load build configs
var isDist = false;

var libraryConfig = require('./src/build/library.config');
var webpackConfig = require('./src/build/webpack.config');


// base variables
var distPath = './htdoc/assets/dist';
var appEntry = './src/app/app.ts';

var sassIncludePaths = ['./node_modules/foundation-sites/scss'];
var stylesWatch = 'src/styles/**/*.scss';
var tsWatch = 'src/app/**/*.ts';

var reloadWatch = [
    "templates/**/*.latte",
    "htdoc/assets/dist/js/**/*.js"
];

function swallowError(error) {
    console.log(error.toString());
}

/* build lib */
gulp.task('library:bundle', function () {
    return gulp.src(libraryConfig.jsVendorLibraries)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(distPath + '/js'));
});

gulp.task('css:bundle', function () {
    return gulp.src(libraryConfig.cssVendorLibraries)
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(distPath + '/css'));
});


/* compile TS & bundle App */
gulp.task('webpack', function () {
    return gulp.src(appEntry)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(distPath + '/js'));
});


/* compile sass task */
gulp.task('sass', function () {
    return gulp.src(stylesWatch)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: sassIncludePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(distPath + '/css'))
        .pipe(reload({
            stream: true
        }));
});

// clean dist path before "gulp dist"
gulp.task('clean', function () {
    return del([
        distPath + '/**/*'
    ]);
});

gulp.task('sass:dist', function () {
    return gulp.src(stylesWatch)
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: sassIncludePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(distPath + '/css'));
});

gulp.task('server', ['sass', 'webpack', 'library:bundle', 'css:bundle'], function () {

    browserSync.init({
        browser: "google chrome",
        proxy: {
            target: 'http://127.0.0.1:8000'
        }
    });

    // watch tasks
    gulp.watch(stylesWatch, ['sass']);
    gulp.watch(tsWatch, ['webpack']);
    gulp.watch(reloadWatch).on('change', reload);

});

gulp.task('dist',function(callback) {
    runSequence(
        'clean',
        ['sass', 'webpack', 'library:bundle', 'css:bundle'],
        callback
    );
});


gulp.task('default', ['dist']);
