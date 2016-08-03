var dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
var dir_desktop = require("path").join(dir_home, "Desktop");

console.log(dir_desktop);

var chokidar = require('chokidar')
var watcher = chokidar.watch(dir_desktop, {	//watch対象ディレクトリorファイル
  ignored: /.+\.(lnk)/,	//無視する対象
  persistent:true	//監視を継続するかどうか
})


watcher.on('ready', ()=>{
  watcher
    .on('add', function(path) { console.log("追加ファイル-> " + path); })
    .on('addDir', function(path) { console.log("追加ディレクトリ-> " + path); })
    .on('unlink', function(path) { console.log("削除されました-> " + path); })
    .on('unlinkDir', function(path) { console.log("削除されました-> " + path); })
    .on('change', function(path) { console.log("修正されました-> " + path); })
    .on('error', function(error) { console.log("エラーです-> " + error); })
});
