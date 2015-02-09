var gulp = require('gulp'), 
	path = require('path'),
	boilerplate = require('boilerplate-gulp'),
	jshint = require('gulp-jshint'),
	clean = require('gulp-clean'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
	refresh = require('gulp-livereload'),
	plato = require('gulp-plato'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	webserver = require('gulp-webserver')
	open = require ('gulp-open'),
	rsync = require('gulp-rsync');

//clean deletes files and directories so that the build is clean before starting.
gulp.task('clean', ['lint'], function () {
	return gulp.src(['./dist/*', './build/*'], { read: false })
		.pipe(clean());
});

//lint performs a jshint on a directory
gulp.task('lint', function() {
  return gulp.src(['./src/js/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('less', ['clean'], function () {
	return gulp.src('./src/css/*.less')
		.pipe(less({
			paths: [
				path.join(__dirname, 'src', 'css')
			]
		}))
		.pipe(gulp.dest('./build'));
});

//uglify minifies JS
gulp.task('uglify', ['clean'], function(){
	return gulp.src([
			'./bower_components/ember/ember.prod.js',
			'./src/js/app/app.js',
			'./src/js/app/**/*.js'
			//'./bower_components/angular-ui-router/release/angular-ui-router.js'
		])
		//.pipe(uglify({ compress: false }))
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest('./dist/js'));
});

//plato is a report generator
gulp.task('plato', function(){
	return gulp.src('./src/js/app/**/*.js')
		.pipe(plato('report', {
			jshint: {
				options: {
					strict: false
				}
			},
			complexity: {
				trycatch: true
			}
		}));
});

//css-min
gulp.task('cssmin', ['less'],  function () {
    return gulp.src(['./src/css/**/*.css', './build/**/*.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['lint', 'cssmin', 'uglify'], function(){
	return gulp.src(['./src/**/*.html', './src/**/images/**/*', './src/js/**/*.html'])
		.pipe(gulp.dest('./dist/'));
});

gulp.task('webserver', function() {
  gulp.src( './dist/' )
    .pipe(webserver({
      host:             'localhost',
      port:             8080,
      livereload:       true,
      fallback: 'index.html'
    }));
});

// Watch Task (watches for changes)
gulp.task('watch', function(){
    gulp.watch('src/**/*.html', ['build']);
    gulp.watch('src/js/**/*.js', ['lint', 'uglify', 'build']);
    gulp.watch('src/css/**/*.less', ['less', 'cssmin', 'build']);
    gulp.watch('src/images/**/*', ['build']);
});

// Open Task (starts app automatically)
gulp.task("open", function(){
	var options = {
		url: "http://localhost:8080",
		app: "Chrome"
	};
	gulp.src("dist/index.html")
		.pipe(open("", options));
});

gulp.task('rsync', ['build'], function(){
	gulp.src('dist')
		.pipe(rsync({
			root: 'dist',
			hostname: '192.168.1.201',
			destination: '/var/www/opencodeproject.com',
			recursive: true,
			clean: true,
			progress: true
		}));
});

gulp.task('default', ['lint', 'clean', 'uglify', 'less', 'cssmin', 'build', 'webserver', 'watch']);
gulp.task('report', ['plato']);
gulp.task('deploy', ['build', 'rsync']);