var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var fs = require('fs-extra');
var Rx = require('rx');
var Promise = require('bluebird');

var readdir = Promise.promisify(fs.readdir);
var copy = Promise.promisify(fs.copy);

var EventEmitter = require('events');
var emitter = new EventEmitter();

var dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
var dir_desktop = require("path").join(dir_home, "Desktop");

var mainWindow = null;

var chokidar = require('chokidar');
var watcher = chokidar.watch(dir_desktop, { ignored: /.+\.(lnk)/, persistent: true });

require('shutdown-handler').on('exit', function() {
  fs.readDir('dir_desktop', dir=>{
    Rx.Observable.from(dir)
      .subscribe(filepath=>console.log(filepath));
  })
});

app.on('window-all-closed', ()=>{});

app.on('ready', function() {
  
  var createModal = (path)=>{Rx
    let win = new BrowserWindow({ width: 440, height: 330, frame: false, transparent: true })
    win.setAlwaysOnTop(true)
    win.setResizable(false)
    win.setMinimizable(false)
    win.on('close', function () { win = null })
    win.loadURL('file://' + __dirname + '/alert.html')
    win.show()
    return win;
  }
  
  var backup = ()=>{
    Rx.Observable.fromPromise(readdir(dir_desktop))
      .flatMap(e=>e)
      .where(file=>/^((?!.lnk$).)*$/.test(file))
      .subscribe(file=>{
        var datestr = (new Date()).toLocaleString().replace(/( |:|-)/g, '');
        copy(dir_desktop+'\\'+file, 'D:\\backup\\'+datestr+'\\'+file)
          .catch(err=>console.error(err));
      });
  }
  
  watcher.on('ready', ()=>{
    watcher
      .on('add', path=>emitter.emit('fileUpdate', path))
      .on('addDir', path=>emitter.emit('fileUpdate', path))
  });
  
  Rx.Observable.fromEvent(emitter, 'fileUpdate')
//    .throttleFirst(30*1000)
    .subscribe(path=>createModal(path));
  
});