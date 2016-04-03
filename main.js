/**
 * Created by yang on 2016/3/31.
 */
'use strict';

const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Tray = electron.Tray;

var tray = null;
var win = null;

app.on('ready', function() {
    createWindow();
    initTray();
    hotkey();
});

app.on('window-all-closed', function() {
    app.quit();
});

app.on('activate', function() {
    if (!win) {
        createWindow();
    }
    if (!tray) {
        initTray();
    }
});

function createWindow() {
    win = new BrowserWindow({
        icon: 'res/yliyun_64.png',
        title: '一粒云盘',
        width: 800,
        height: 600,
        autoHideMenuBar: true
    });
    win.loadUrl(__dirname + '/index.html');

    //win.webContents.openDevTools();

    win.on('close', function(event) {
        event.preventDefault();
        win.hide();
    });

    win.on('closed', function() {
        win = null;
    });
}

function initTray() {
    tray = new Tray('res/yliyun.ico');
    tray.setToolTip('一粒云盘');

    tray.on('click', function() {
        win.show();
    });

    var menu = new Menu();
    menu.append(new MenuItem({
        icon: 'res/yliyun_16.png',
        label: '打开云盘网页版',
        click: function() {
            electron.shell.openExternal('http://www.yliyun.com');
        }
    }));
    menu.append(new MenuItem({
        icon: 'res/ios7-paperplane-outline-16.png',
        label: '在线升级',
        click: function() {
            //
        }
    }));
    menu.append(new MenuItem({
        type: 'separator'
    }));
    menu.append(new MenuItem({
        icon: 'res/off_black_16.png',
        label: '退出',
        click: function() {
            //tray.destroy();
            win.destroy();
            app.quit();
        }
    }));

    tray.setContextMenu(menu);

}

function hotkey() {
    var globalShortcut = electron.globalShortcut;

    globalShortcut.register('ctrl+f12', function() {
        win.webContents.openDevTools({
            detach: true
        });
    });

    globalShortcut.register('ctrl+f5', function() {
        win.webContents.reload();
    });
}
