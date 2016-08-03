var fs = require('fs-extra');
var Rx = require('rx');
var Promise = require('bluebird');

var readdir = Promise.promisify(fs.readdir);
var copy = Promise.promisify(fs.copy);

var dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
var dir_desktop = require("path").join(dir_home, "Desktop");

Rx.Observable.fromPromise(readdir(dir_desktop))
  .flatMap(e=>e)
  .where(file=>/^((?!.lnk$).)*$/.test(file))
  .subscribe(file=>{
    var datestr = (new Date()).toLocaleString().replace(/( |:|-)/g, '');
    copy(dir_desktop+'\\'+file, 'D:\\backup\\'+datestr+'\\'+file)
      .catch(err=>console.error(err));
  });