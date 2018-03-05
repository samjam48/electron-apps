# Video Converter

A tool for converting a group of videos from one format to another. We learn how to use the ffmpeg library to convert video. Promises for loading files and more electron basics.


### Getting started

`npm install`

Start dev server:

`npm start`

In a new terminal window:

`npm run electron`

### React-dropzone

npm plugin that gives us a nice easy way for the user to drag and drop files into the app.


### React Redux with Electron - Action creators

Vid 64 - Overview of the app

In general it is best to keep all your exchange of data between the React and electron app in your Redux Action Creators.
This is kind of the hub for taking in changes and sending of changes and it also helps with organisation of your code to keep in a unified place.

### Promises for metadata

We handle a whole list of videos and try to get their metadata. We put these into a bunch of promises so that we can make all the calls asynchronously and it doesn't matter which ones take longer or slower to process.
We then wait for all the results with a promise.all statement that informs the program that the process is finally complete.

```
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
```

### Conversion with FFMPEG - fluent-ffmpeg

We use the npm package fluent-ffmpeg to handle ffmpeg instructions. To convert a file we simpley give the input path and the output path and filetype.
We also go further in our code to get an update on progress by finding the time point in the video that ffmpeg is at during conversion and sending this to the front end to then render a percentage bar.
Once the conversion is complete we also alert React of this status.

```
ipcMain.on('conversion:start', (event, videos) => {
    const keyNames = Object.keys(videos);

    _.each(keyNames, key => {
        const video = videos[key]
        const outputDirectory = video.path.split(video.name)[0];
        const outputName = video.name.split('.')[0];
        const outputPath = `${outputDirectory}${outputName}.${video.format}`;
        console.log(video.path);
        console.log(outputPath);

        ffmpeg(video.path)
            .output(outputPath)
            .on('progress', ({ timemark }) =>
                mainWindow.webContents.send('conversion:progress', { video, timemark })
            )
            .on('end', () =>
                mainWindow.webContents.send('conversion:end', { video, outputPath })
            )
            .run();
    })
});
```

### Opening Folders from the app

WE use the shell to access folders. WE send the file path from react to electron. In electron we use the shell.showItemInFolder commanf to open it.

```
ipcMain.on('folder:open', (event, outputPath) => {
    shell.showItemInFolder(outputPath);
});
```

### Issues

* Once complete you can still convert the file again
* X button doesn't stop conversion process once started
* X button doesn't close file list box even when it becomes empty after the last file is removed.


### Extra Tasks

* Change file / screen size To convert for ipad
* Audio
    * handle audio file conversion
    * Shorten audio file length
* Text
    * convert between e-book formats
    * convert between text docs
* pdf
    * append pdf's together so multiple docs become one single doc

