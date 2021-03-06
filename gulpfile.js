'use strict';
var gulp = require("gulp");
var electron = require("electron-connect").server.create();
gulp.task("default", function () {
// Start browser process
 electron.start();
// Restart browser process
 gulp.watch("main.js", electron.restart);
// Reload renderer process
 gulp.watch(["./Projects/TheForest/forest.html"], electron.reload);
 gulp.watch(["./Projects/TheForest/forest.js"], electron.reload);
});