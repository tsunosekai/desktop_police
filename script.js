var remote = require('electron').remote;

console.log('allala')

window.onload = ()=>{
  
  document.getElementById("ok").addEventListener("click", function (e) {
    console.log('uooo');
    var window = remote.getCurrentWindow();
    window.close();
  });
  
}

