/**
 * Created by yang on 2016/4/1.
 */
'use strict';

const os = require('os');
const proc = require('child_process');
const gulp = require('gulp');
const packager = require('electron-packager');
const jetpack = require('fs-jetpack');
const shelljs = require('shelljs');

const manifest = require('./src/package.json');

var _isMac = os.type() === 'Darwin';

gulp.task('clean', () => {
    jetpack.remove('./build');
    jetpack.remove('./release');
});

gulp.task('build', () => {
    jetpack.dir('./build', { empty: true});
    jetpack.copy('./src/app', './build', { overwrite: true });
    jetpack.copy('./src/res', './build/res', { overwrite: true });
    jetpack.copy('./src/package.json', './build/package.json', { overwrite: true });
});

gulp.task('start', () => {
    let electron = 'cache/electron-v1.2.8-win32-ia32/electron.exe';
    if (_isMac) {
        electron = 'cache/electron-v1.2.8-darwin-x64/Electron.app/Contents/MacOS/Electron';
    }

    let child = proc.spawn(electron, ['build']);

    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

gulp.task('pack', () => {
    jetpack.dir('./publish');
    jetpack.dir('./release', { empty: true });

    jetpack.copy('./cache/electron-v1.2.8-win32-ia32', './release', {
        overwrite: true
    });
    jetpack.rename('./release/electron.exe', 'yliyun.exe');
    jetpack.remove('./release/resources/default_app.asar');
    jetpack.copy('./build', './release/resources/app', {
        overwrite: true
    });

    let rcedit = require('rcedit');

    rcedit('./release/yliyun.exe', {
        icon: './src/res/yliyun.ico',
        'product-version': manifest.version,
        'file-version': manifest.version,
        'version-string': {
            'ProductName': '一粒云盘',
            'FileDescription': 'yliyun executor',
            'ProductVersion': manifest.version,
            'CompanyName': '深圳一粒云科技有限公司',
            'LegalCopyright': '© 2016, yliyun.com',
            'OriginalFilename': 'yliyun.exe'
        }
    }, (err) => {
        if (err) {
            console.error('rcedit err', err);
            return;
        }
        console.log('rcedit ok');
    });

    //require('winresourcer')({
    //    operation: 'Add', // one of Add, Update, Extract or Delete
    //    exeFile: './publish/yliyun.exe',
    //    resourceType: 'Icongroup',
    //    resourceName: 'IDR_MAINFRAME',
    //    lang: 1033, // Required, except when updating or deleting
    //    resourceFile: './src/res/yliyun.ico' // Required, except when deleting
    //}, function(err) {
    //    if (err) {
    //        console.error('winresourcer err', err);
    //        return;
    //    }
    //    console.log('winresourcer ok');
    //});
});

// 生成安装包
gulp.task('install', function() {
    // windows安装包
    shelljs.exec('makensis ./res/install.nsi');
});

gulp.task('default', ['build']);