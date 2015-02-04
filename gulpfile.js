var gulp = require('gulp'),
    deploy = require('gulp-gh-pages');

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(deploy())
})

gulp.task('default', function() {
  // place code for your default task here
});
