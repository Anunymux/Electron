const electron = require('electron')
const appEnv = 'development'

require('electron-debug')({ showDevTools: false });
var client = require("electron-connect").client;

const app = electron.app
const BrowserWindow = electron.BrowserWindow

app.on('ready', _ => { 

    console.log(`Ready`);

    if (appEnv === 'development') {    
        BrowserWindow.addDevToolsExtension(`${__dirname}/ChromeExtensions/nhdogjmejiglipccpnnnanhbledajbpd/2.3.1_0`);
    }

    var win = new BrowserWindow({
        width: 605,
        height: 770,
        alwaysOnTop: false,
        frame: true,
        transparent:false
    })

    win.on('close', function () {
        console.log('Closed!');
        win = null
    })

    win.webContents.on('crashed', function (event, killed) {
        PresentErrorNicely(err)
        alert(`Event: ${event} killed:${killed}`)
    })

    win.on('unresponsive', function (event) {
        PresentErrorNicely(err)
        alert(`Event: ${event}`)
    })

    /*win.loadURL(`${__dirname}/pwGenerator.html`)*/
    win.loadURL(`${__dirname}/Projects/TheForest/forest.html`)

    client.create(win);
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

process.on('uncaughtException', function (err) { 
    PresentErrorNicely(err)
    alert(`Event: ${event}`)
})
