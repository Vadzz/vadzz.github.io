var syntax          = 'scss'; // Syntax: sass or scss;

var gulp        	= require('gulp'),
    sass        	= require('gulp-sass'),
    browserSync 	= require('browser-sync'),
    del         	= require('del'),
    imagemin    	= require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    cache       	= require('gulp-cache'),
    autoprefixer 	= require('gulp-autoprefixer'),
    gcmq            = require('gulp-group-css-media-queries'),
    plumber         = require('gulp-plumber'),
    gutil           = require('gulp-util'),
    sourcemaps      = require('gulp-sourcemaps'),
    cssbeautify     = require('gulp-cssbeautify'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglifyjs'),
    cssnano         = require('gulp-cssnano'),
    rename          = require('gulp-rename');

gulp.task('styles', function() {
	return gulp.src(''+syntax+'/**/*.'+syntax+'')
	.pipe(plumber(function(error) {
	  gutil.log(gutil.colors.bold.red(error.message));
	  gutil.beep();
	  this.emit('end');
	 }))
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(['last 15 version', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(plumber.stop())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
	return gulp.src([
		'node_modules/slick-carousel/slick/slick.min.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('js'))
});

gulp.task('css-libs', function() {
	return gulp.src([
		'node_modules/slick-carousel/slick/slick.scss'
	])
	.pipe(concat('libs.min.css'))
	.pipe(cssnano())
	// .pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './',
			index: "index.html",
            directory: true
		},
		watchTask: true
	});
});

gulp.task('build', ['clean','img', 'styles'], function() {
	var buildCSS = gulp.src([
		'css/main.css',
		'css/libs.min.css'
	])
		.pipe(cssbeautify())
 		.pipe(gcmq())
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJS = gulp.src('js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHTML = gulp.src('*.html')
		.pipe(gulp.dest('dist'))
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('images/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/images'));
});

// gulp.task('styles', function() {
//   return gulp.src('css/main.css')
//     .pipe(csscomb())
//     .pipe(gulp.dest('dist/css'));
// });

gulp.task('watch', ['browser-sync', 'styles', 'css-libs', 'scripts'] , function() {
	gulp.watch(''+syntax+'/**/*.'+syntax+'', ['styles']);
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('**/*.css', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});