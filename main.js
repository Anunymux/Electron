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
        frame: false,
        transparent:false
    })

    win.on('close', function () {
        console.log('Closed!');
        win = null
    })

    win.loadURL(`${__dirname}/index.html`)  
})





