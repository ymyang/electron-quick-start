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

var shouldQuit = app.makeSingleInstance(function(cmd, workingDir) {
    console.log('cmd:', cmd, ', workingDir:', workingDir);
    // 当另一个实例运行的时候，这里将会被调用，我们需要激活应用的窗口
    if (win) {
        if (win.isMinimized()) {
            win.restore();
        }
        win.focus();
    }
});

// 这个实例是多余的实例，需要退出
if (shouldQuit) {
    app.quit();
    return;
}

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
    } else {
        win.show();
    }
    if (!tray) {
        initTray();
    }
});

function createWindow() {
    win = new BrowserWindow({
        icon: __dirname + '/res/yliyun_64.png',
        title: '一粒云',
        width: 800,
        height: 600,
        autoHideMenuBar: true
    });
    win.loadURL('file://' + __dirname + '/index.html');

    win.on('close', function(event) {
        event.preventDefault();
        win.hide();
    });

    win.on('closed', function() {
        win = null;
    });
}

function initTray() {
    tray = new Tray(__dirname + '/res/yliyun_16.png');
    tray.setToolTip('一粒云');

    tray.on('click', function() {
        win.show();
    });

    var menu = new Menu();
    menu.append(new MenuItem({
        icon: __dirname + '/res/yliyun_16.png',
        label: '打开云盘网页版',
        click: function() {
            electron.shell.openExternal('http://www.yliyun.com');
        }
    }));
    menu.append(new MenuItem({
        icon: __dirname + '/res/ios7-paperplane-outline-16.png',
        label: '在线升级',
        click: function() {
            //
        }
    }));
    menu.append(new MenuItem({
        type: 'separator'
    }));
    menu.append(new MenuItem({
        icon: __dirname + '/res/off_black_16.png',
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

    globalShortcut.register('CommandOrControl+F12', function() {
        win.webContents.openDevTools({
            detach: true
        });
    });

    globalShortcut.register('CommandOrControl+F5', function() {
        win.webContents.reload();
    });
}
