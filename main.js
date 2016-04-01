/**
 * Created by yang on 2016/3/31.
 */
'use strict';

const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

function createWindow() {
    console.log('createWindow start');

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        console.log('mainWindow closed');
        mainWindow = null;
    });

    console.log('createWindow end');
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    console.log('window-all-closed');
    app.quit();
});

app.on('activate', function() {
    console.log('activate');
    if (!mainWindow) {
        createWindow();
    }
});