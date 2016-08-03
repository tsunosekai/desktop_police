var fs = require('fs-extra');
var path = require('path');
var Rx = require('rx');

var dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
var dir_desktop = require("path").join(dir_home, "Desktop");

console.log(dir_desktop);

fs.move(path.join(dir_desktop, 'cc.txt'), 'D:\\backup\\'+'aa.txt', function (err) {
  if (err) return console.error(err)
  console.log("success!")
})