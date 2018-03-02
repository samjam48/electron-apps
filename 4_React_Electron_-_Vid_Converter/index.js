const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const _ = require('lodash');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: { backgroundThrottling: false }
    });
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});


ipcMain.on('videos:added', (event, videos) => {
    // run through list of videos and make a promise for each
    const promises = _.map(videos, video => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(video.path, (err, metadata) => {
                video.duration = metadata.format.duration;
                video.format = 'avi';
                resolve(video);
            });
        });
    });

    // Wait for all promises to be resolved
    Promise.all(promises)
        .then((results) => {
            mainWindow.webContents.send('metadata:complete', results);
        });

});

ipcMain.on('conversion:start', (event, videos) => {
    const keyNames = Object.keys(videos);
    const video = videos[keyNames[0]]

    console.log('===========================');
    console.log(video);

    const outputDirectory = video.path.split(video.name)[0];
    const outputName = video.name.split('.')[0];
    const outputPath = `${outputDirectory}${outputName}.${video.format}`;
    console.log(video.path);
    console.log(outputPath);

    ffmpeg(video.path)
        .output(outputPath)
        .on('end', () => console.log('Video conversion complete'))
        .run();
});
