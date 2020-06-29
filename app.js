const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

/**@type {Electron.BrowserWindow} */
let window;

app.on('ready', function() {
    window = new BrowserWindow({
        width: 1100, height: 700,
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        minWidth: 1000, minHeight: 700
    });

    window.loadURL(url.format({
        protocol: `file:`,
        pathname: path.join(__dirname, `src/login.html`),
        slashes: true
    }));

    window.once('ready-to-show', function() {
        window.show();
    })
});