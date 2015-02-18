"use strict";

const PSEUDO_WORDPRESS_GEN = false;
const SOURCEMAPS = false;
const MINIFY = false;

var _ = require('lodash');
// Global
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var path = require('path');
var concat = require("gulp-concat");
//JS
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
// Styles
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
// Sitegen
var prettifyHtml = require('gulp-html-prettify');
var minifyHtml = require('gulp-minify-html');
var prettify = require('gulp-prettify');
var nunjucksRender = require('gulp-nunjucks-render');
// Autowire from bower
var wiredep = require('wiredep').stream;
// Wordpress
var batchReplace = require('gulp-batch-replace');

var UGLIFY = {
  sequences: true, // join consecutive statemets with the “comma operator”
  properties: true, // optimize property access: a["foo"] → a.foo
  dead_code: true, // discard unreachable code
  drop_debugger: true, // discard “debugger” statements
  unsafe: true, // some unsafe optimizations (see below)
  conditionals: true, // optimize if-s and conditional expressions
  comparisons: true, // optimize comparisons
  evaluate: true, // evaluate constant expressions
  booleans: true, // optimize boolean expressions
  loops: true, // optimize loops
  unused: true, // drop unused variables/functions
  hoist_funs: true, // hoist function declarations
  hoist_vars: true, // hoist variable declarations
  if_return: true, // optimize if-s followed by return/continue
  join_vars: true, // join var declarations
  cascade: true, // try to cascade `right` into `left` in sequences
  side_effects: true, // drop side-effect-free statements
  warnings: true, // warn about potentially dangerous optimizations/code
  global_defs: {} // global definitions
};

var CSS = {
  noAdvanced: true
};

var nunjucksData = require('./util/load-directory.js')('./src/templates-data', {
  currentDir: __dirname,
  type: '.json',
  recursive: true,
  require: true,
});

gulp.task('copy', function () {
  gulp.src('./src/assets/**/*.*')
    .pipe(gulp.dest('./compiled/assets'));
});

gulp.task('css', function () {
  return gulp.src([
      "./src/examples/less/*.less",
    ])
    .pipe(gulpIf(SOURCEMAPS, sourcemaps.init()))
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['> 1%'],
      cascade: false
    }))
    .pipe(gulpIf(MINIFY, cssmin(CSS)))
    .pipe(gulpIf(MINIFY, concat('style.min.css')))
    .pipe(gulpIf(SOURCEMAPS, sourcemaps.write()))
    .pipe(gulp.dest('./compiled/examples/css'));
});


gulp.task('scripts', function () {
  return gulp.src(['./src/js/**/*.js'])
    .pipe(gulpIf(SOURCEMAPS, sourcemaps.init()))
    .pipe(gulpIf(MINIFY, uglify(UGLIFY)))
    .pipe(gulpIf(MINIFY, concat('scripts.min.js')))
    .pipe(gulpIf(SOURCEMAPS, sourcemaps.write()))
    .pipe(gulp.dest('./compiled/js'));
});
gulp.task('html', function () {
  nunjucksRender.nunjucks.configure(['./src/examples', './src/tasks']);
  return gulp.src('./src/**/*.html')
    .pipe(wiredep())
    .pipe(gulpIf(!PSEUDO_WORDPRESS_GEN, nunjucksRender(nunjucksData)))
    .pipe(gulpIf(!PSEUDO_WORDPRESS_GEN, prettifyHtml({
      ident_size: 2,
      indent_inner_html: true
    })))
    .pipe(gulp.dest('./compiled/'));
});

gulp.task('watch', function () {
  gulp.watch('./src/js/*.js', ['scripts']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/less/*.less', ['css']);
  gulp.watch('./src/assets/*.*', ['copy']);
});


gulp.task('compile', ['copy', 'css', 'html', 'scripts']);


gulp.task('default', ['compile', 'watch']);
