var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
const themekit = require('@shopify/themekit');

gulp.task('js', function () {
    return gulp.src('app/js/*.js')
        .pipe(concat('custom-all.js'))
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('assets'));
});

gulp.task("sass", function () {
    return gulp
        .src("app/scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(plumber())
        .pipe(
            cleanCSS({
                compatibility: "ie8",
                level: {
                    1: {
                        all: true,
                        removeProperty: /-webkit-box-orient/i, // Remove -webkit-box-orient property
                    },
                    2: {
                        mergeMedia: true,
                        removeDuplicateFontRules: true,
                        removeEmpty: true,
                    },
                },
                keepSpecialComments: 0, // Remove all comments
            })
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("assets"))
        .pipe(livereload());
});

gulp.task('watch-dev', function () {
    var server = livereload();
    // livereload({ start: true });
    gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('app/js/**/*.js', gulp.series('js'));
    themekit.command('watch', {
        env: 'development'
    })
});

gulp.task('watch-live', function () {
    var server = livereload();
    // livereload({ start: true });
    gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('app/js/**/*.js', gulp.series('js'));
    themekit.command("watch", {
        env: "production",
        allowLive: true
    });
});

// gulp.task('default', ['sass', 'js', 'watch']);
gulp.task('default', gulp.parallel('sass', 'js', 'watch-dev')); // for development
gulp.task('default', gulp.parallel('sass', 'js', 'watch-live')); // for production