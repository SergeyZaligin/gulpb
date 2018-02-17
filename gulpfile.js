const gulp = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const uglify = require('gulp-uglifyjs');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch("build").on('change', browserSync.reload);
});

gulp.task('html', function() {
	return gulp
		.src('src/**/*.html')
		.pipe(gulp.dest('build'))
		.pipe(browserSync.stream());
});

gulp.task('sass', function() {
	return gulp
		.src('src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(csso())
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
		}))
		.pipe(plumber())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', function() {
	return gulp
	  .src('src/js/**/*.js')
	  .pipe(
		babel({
		  presets: ['es2015'],
		})
	  )
	  .pipe(concat('main.js'))
	  .pipe(uglify())
	  .pipe(plumber())
	  .pipe(rename({suffix: '.min'}))
	  .pipe(gulp.dest('build/js'))
	  .pipe(browserSync.stream());
  });

  gulp.task('img', function() {
	return gulp
	  .src('src/images/**/*')
	  .pipe(
		imagemin({
		  progressive: true,
		  svgoPlugins: [{ removeViewBox: false }],
		  use: [pngquant()],
		  interlaced: true,
		})
	  )
	  .pipe(rename({suffix: '.min'}))
	  .pipe(gulp.dest('build/images'))
	  .pipe(browserSync.stream());
  });

gulp.task('watch', function() {
	gulp.watch('src/**/*.html', gulp.series('html'));
	gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/images/**/*', gulp.series('img'));
});

gulp.task('default', gulp.series(gulp.parallel('html', 'sass', 'js', 'img'), gulp.parallel('watch', 'browser-sync')));
