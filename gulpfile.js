/**
 * Created by yang on 2016/4/1.
 */
var gulp = require('gulp');
var packager = require('electron-packager');

gulp.task('pack', function() {
    packager({
        arch: 'ia32',
        dir: '.',
        platform: 'win32',
        version: '0.36.12',
        cache: './tmp',
        out: './release',
        asar: false,
        overwrite: true,
        name: 'yliyun',
        appVersion: '1.7.2',
        appCopyright: 'yliyun.com'
    }, function(err, app) {
        if (err) {
            console.error('pack err', err);
        }
        console.log('pack finish', app);

    });
});