/**
 * Created by yang on 2016/4/1.
 */
'use strict';

const os = require('os');
const proc = require('child_process');
const gulp = require('gulp');
const packager = require('electron-packager');
const jetpack = require('fs-jetpack');

var _isMac = os.type() === 'Darwin';

gulp.task('clean', () => {
    jetpack.remove('./build');
});

gulp.task('build', () => {
    jetpack.dir('./build', { empty: true});
    jetpack.copy('./src/res', './build/res', { overwrite: true });
    jetpack.copy('./src/app', './build', { overwrite: true });
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


gulp.task('publish', () => {
    jetpack.dir('./publish', { empty: true });
    jetpack.copy('./cache/electron-v1.2.8-win32-ia32', './publish', {
        overwrite: true
    });
    jetpack.rename('./publish/electron.exe', 'yliyun.exe');
    jetpack.remove('./cache/electron-v1.2.8-win32-ia32/resources/default_app.asar');
    jetpack.copy('./build', './cache/electron-v1.2.8-win32-ia32/resources/app', {
        overwrite: true
    });

    require('winresourcer')({
        operation: 'Add', // one of Add, Update, Extract or Delete
        exeFile: './publish/yliyun.exe',
        resourceType: 'Icongroup',
        resourceName: 'IDR_MAINFRAME',
        lang: 1033, // Required, except when updating or deleting
        resourceFile: './src/res/yliyun.ico' // Required, except when deleting
    }, function(err) {
        if (err) {
            console.error('winresourcer err', err);
            return;
        }
        console.log('winresourcer ok');
    });
});

gulp.task('pack', () => {
    packager({
        arch: 'ia32',
        dir: './build',
        platform: 'win32',
        version: '1.2.8',
        cache: './tmp',
        out: './release',
        asar: false,
        overwrite: true,
        name: 'yliyun',
        appVersion: '1.7.2',
        appCopyright: 'yliyun.com'
    }, (err, app) => {
        if (err) {
            console.error('pack err', err);
        }
        console.log('pack finish', app);

    });
});

gulp.task('default', ['build']);