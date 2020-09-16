var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");

gulp.task("copy-zumocore", function () {
  return gulp.src("zumocore/zumocore.*").pipe(gulp.dest("dist"));
});

gulp.task("copy-decimal", function () {
  return gulp.src("node_modules/decimal.js/decimal.js").pipe(gulp.dest("dist"));
});

gulp.task("default",
  gulp.series(
    gulp.parallel("copy-zumocore"),
    gulp.parallel("copy-decimal"),
    function () {
      return browserify({
        basedir: ".",
        debug: true,
        entries: ["index.ts"],
        cache: {},
        packageCache: {},
        bundleExternal: false
      })
        .plugin(tsify)
        .bundle()
        .pipe(source("zumokit.js"))
        .pipe(gulp.dest("dist"));
}));