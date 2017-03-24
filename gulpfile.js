// gulpfile
var gulp = require('gulp'),
plumber = require('gulp-plumber'),
sass = require('gulp-sass'),
cssnano = require('gulp-cssnano'),
autoprefixer = require('gulp-autoprefixer'),
browserify = require('browserify'),
babelify = require('babelify'),
uglify = require('gulp-uglify'), 
source = require('vinyl-source-stream'),
buffer = require('vinyl-buffer'),
sourcemaps = require('gulp-sourcemaps'),
rename = require('gulp-rename'),
browserSync = require('browser-sync'),
package = require('./package.json');

gulp.task('css', function () {
    return gulp.src('src/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function(){
    gulp.src(
        ['src/js/*.js',
        'src/js/*.es6'])
        return browserify({entries: 'src/scripts/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        //.on('error', console.error.bind(console)) // doesn't work
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('html', function() {
	console.log('>>>>in HTML task');
	  gulp.src('src/html/*.html')
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.reload({stream:true, once:true}));
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});


// default task
gulp.task('default', [ 'css', 'js', 'browser-sync'], function () {

	gulp.watch(["src/html/*.html", ], ['html']);
	gulp.watch("src/scss/**/*.scss", ['css']); // Sass (.scss) to CSS
	gulp.watch("src/scripts/*.js", ['js']);    // ES6->ES5 convert, bundle
	gulp.watch("app/*.html", ['bs-reload']);   // Reload page in browser

});








