var gulp = require('gulp');
var uncss = require('gulp-uncss');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var nano = require('gulp-cssnano');
var uglify = require('gulp-uglify');

gulp.task('js-vendor-uglify', function (done) {
    gulp.src(['www/scripts/utility/*.js', 'www/app/util/*.js',
        'www/scripts/bootstrap/*.js',
        'www/scripts/angular/*.js',
        'www/app/util/*.js',
        'www/scripts/angular-cache.min.js',
        'www/scripts/lodash.min.js'])
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('www/scripts/'));

});

gulp.task('js-app-launcher-uglify', function (done) {
    gulp.src(['www/App/common/*.js',
        'www/App/appLauncher.js',
        'www/App/bootstrap/b-config.js',
        'www/App/services/spContext.js'
    ])
        .pipe(concat('applauncher.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/'));

});

gulp.task('js-app-bootstrap-uglify', function (done) {
    gulp.src(['www/app/bootstrap/*.js',
        'www/app/common/*.js',
        'www/app/layout/*.js',
        'www/app/filter/*.js',
        'www/app/services/**/*.js',
        'www/app/controller/**/*.js'
        ])
        .pipe(concat('app.min.js'))

        .pipe(gulp.dest('www/app/'));

});

gulp.task('css-uncss', function () {
    return gulp.src(['www/Content/**/*.css', '!www/Content/**/*app.min.css'])
        .pipe(concat('app.min.css'))
        .pipe(uncss({
            html: ["www/app/**/*.html", "www/pages/**/*.html"]
        }))
        .pipe(nano())
        .pipe(gulp.dest('www/content/out'));
});

gulp.task('build', ['js-vendor-uglify', 'js-app-launcher-uglify', 'js-app-bootstrap-uglify', 'css-uncss']);
gulp.task('default', ['build']);