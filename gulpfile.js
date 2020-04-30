const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' ).create();
const sassToCss = require( 'gulp-sass' );
const notify = require( 'gulp-notify' );
const plumber = require( 'gulp-plumber' );
const autoprefixer = require('gulp-autoprefixer');
const imagemin   = require('gulp-tinypng');
const concat = require('gulp-concat');

gulp.task( 'browser-sync', gulp.series( sass, function() {
    browserSync.init( {
        server: {
            baseDir: "./src"
        }
    } );
    gulp.watch( './src/**/*.html' ).on( 'change', browserSync.reload ); 
    gulp.watch( './src/**/*.js' ).on( 'change', scripts );
    gulp.watch( './src/**/*.scss', gulp.series( sassDefault ) );
    gulp.watch( './src/**/*.{png,jpg,gif}', gulp.series( imageMinDev ) );
} ) );

function html () {
    return gulp.src( './src/index.html' )
        .pipe( gulp.dest( './dist' ) )
};

function css () {
    return gulp.src( './src/style/*.css' )
            .pipe( gulp.dest( './dist/style' ) )
}

function sass () {
    return gulp.src( './src/scss/main.scss' )
        .pipe( plumber( { 
            errorHandler : notify.onError( function( err ) {
                return {
                    title : 'Styles',
                    message : err.message,
                };
            } )
         } ) )
        .pipe( sassToCss() )
        // .pipe( autoprefixer( {
        //     overrideBrowserslist : [ 'last 10 versions' ],
        // } ) )
        .pipe( autoprefixer() )
        .pipe( gulp.dest( './dist/style' ) )
        .pipe( browserSync.stream() ); // точечно
};

function sassDefault () {
    return gulp.src( './src/scss/main.scss' )
            .pipe(  sassToCss() )
            .pipe( autoprefixer()  )
            .pipe( gulp.dest( './src/style' ) )
            .pipe( browserSync.stream() );
}

function scripts () {
    return gulp.src( './src/script/*.js' )
        // .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/script'))
        .pipe( browserSync.reload( { stream : true } ) )
};

function imageMinBuild () {
    return gulp.src( './src/image/*.{png,jpg,gif}' )
        .pipe( imagemin('fxryGv1XF5ZchCNrysdmDZJvQMQxrpxR') )
        .pipe( gulp.dest( './dist/image' ) );
};
function imageMinDev () {
    return gulp.src( './src/image/*.{png,jpg,gif}' )
        .pipe( gulp.dest( './dist/image' ) );
};

gulp.task( 'default', gulp.series( 
    gulp.parallel ( scripts, sassDefault ), 
    gulp.parallel ( 'browser-sync' ) ) );

gulp.task( 'build', gulp.series( html, imageMinBuild, scripts, css ) );

