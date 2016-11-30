const electron = require('electron')

require('electron-reload')(__dirname);
require('electron-debug')({ showDevTools: false });

const app = electron.app
const BrowserWindow = electron.BrowserWindow

app.on('ready', _ => { 

    console.log('Ready!');

    var win = new BrowserWindow({
        width: 900,
        height: 500,
        alwaysOnTop: true,
        frame: true,
        transparent:false
    })

    win.on('close', function () {
        console.log('Closed!');
        win = null
    })

    win.webContents.on('crashed', function (event, killed) {
         alert(`Event: ${event} killed:${killed}`)
    })

    win.loadURL(`${__dirname}/index.html`)  
})

function PresentErrorNicely(err){
	var toastr = require('toastr')
	toastr.options = {
		"newestOnTop": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null, 
		"showDuration": "999999",
		"hideDuration": "999999",
		"timeOut":"0",
		"extendedTimeOut":"0",
		"closeButton":true,
		"tapToDismiss": false,
		"progressBar":false
	}

	toastr["error"](err, 'An error has ocured')
}





