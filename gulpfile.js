const { src, dest, task, series, watch } = require("gulp");
const exec = require("child_process").exec;
const htmlreplace = require("gulp-html-replace");
const csso = require("gulp-csso");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const md5File = require("md5-file");

/**
 * Task: Tailwind
 */
task("tailwind", function (cb) {
  const command =
    "npx tailwindcss -i ./src/assets/css/tailwind-blog.css -o ./public/assets/dist/css/tailwind-blog.css";
  exec(command, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/**
 * Task: Prettier
 */
task("pretty", function (cb) {
  const command = "npx prettier --write src/pages/*.html";
  exec(command, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/**
 * Task: Export images and pages to public
 */
task("build-pages", function () {
  return src("./src/pages/*.html").pipe(dest("./public/"));
});


/**
 * Task: Build images
 */
task("build-images", function () {
  return src("./src/assets/images/*.{png,svg,ico,jpg,jpeg}").pipe(
    dest("./public/assets/images/")
  );
});

/**
 * Task: Build favicons
 */
task("build-favicons", function () {
  return src("./*.{png,svg,webmanifest}").pipe(dest("public"));
});

/**
 * Task: Build css version
 */
task("build-css-version", function () {
  const baseFilePath = "./public/assets/dist/css/tailwind-blog.css";
  const hash = md5File.sync(baseFilePath);

  return src(baseFilePath)
    .pipe(csso())
    .pipe(rename(`tailwind-blog-${hash}.css`))
    .pipe(dest("./public/assets/dist/css/"));
});

/**
 * Task: Build html updates
 */
task("build-html-updates", function () {
  const hash = md5File.sync("./public/assets/dist/css/tailwind-blog.css");
  return src("./public/*.html")
    .pipe(
      htmlreplace({
        css: `/assets/dist/css/tailwind-blog-${hash}.css`,
      })
    )
    .pipe(dest("public/"));
});

/**
 * Task: Clean
 */
task("clean", function () {
  return src("./public/assets/dist/css/*.css").pipe(clean());
});

/**
 * Task: watch
 */
task("watch", function () {
  watch("./src/pages/*.html", series("build"));
});

/**
 * Task: Build
 */
task(
  "build",
  series(
    "clean",
    "tailwind",
    "build-pages",
    "build-images",
    "build-css-version",
    "build-html-updates"
  )
);

/**
 * Task: Default
 */
task("default", series("build"));
