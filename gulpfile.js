/**
 * Created by yang on 2016/4/1.
 */
'use strict';

const proc = require('child_process');
const gulp = require('gulp');
// const electron = require('electron-prebuilt');
// const packager = require('electron-packager');
const jetpack = require('fs-jetpack');

gulp.task('clean', () => {
    jetpack.remove('./build');
});

gulp.task('build', () => {
    jetpack.dir('./build', { empty: true});
    jetpack.copy('./src/res', './build/res', { overwrite: true });
    jetpack.copy('./src/app', './build', { overwrite: true });
});

gulp.task('dev', ['build'], () => {
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
    packager({
        arch: 'ia32',
        dir: '.',
        platform: 'win32',
        version: '1.2.1',
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