# System Tray app

A simple timer app made in react.
With electron we make it appear fixed to the system tray 


### Getting started

`npm install`

Start dev server:

`npm start`

In a new terminal window:

`npm run electron`


### System Tray

Instead of using Menu we use the ```tray``` attribute from the electron object.
We can handle clicks to provide a drop down menu on right click (the same format as normal menu).
We can handle left click to toggle the app window to show. We take the x and y properties from the click to work out where to position the window.

Note - Windows and Mac are different again so we need to account for this in how we render the window.
```
onClick(event, bounds){
    // click event bounds - bounds.x, bounds.y
    const { x, y } = bounds;
    
    // Window height and width
    const { width, height } = this.mainWindow.getBounds();

    if (this.mainWindow.isVisible()) {
        this.mainWindow.hide();
    } else {
        const yPosition = process.platform === 'darwin' ? y : y - height;
        this.mainWindow.setBounds({
            x: x - width / 2,
            y: yPosition,
            height,
            width
        });
        this.mainWindow.show();
    }
}
```

#### Issues

Rendering based on the click means the app doesn't move when the system tray icons move.


### Setting side text
We get an update on the time data left and render it to the task tray. This is done by simply setting a title.
```
ipcMain.on("update-timer", (event, timeLeft) => {
    tray.setTitle(timeLeft);
});
```


### Background Processes

By default electron apps slow down when minimized to prevent using system memory.

This isn't useful when your app is a timer.

This can be prevented smip by changing teh web preferences background settings.

```webPreferences: { backgroundThrottling: false }```



### Separating Electron Files by Extending Classes

Any Electron app is going to use a fair few elements in the index.js so you need to compartmentalise the code to keep it cleaner. The different elctron classes that are used in your index.js can be declared in separate files with all their specific properties specified there.

In the files you extend the electron object in question and then apply your properties to create the app specific class that can then be utilised in the index file.

```
class TimerTray extends Tray {
    constructor(){

        // ... code ...

    }

    // ... code ...

}

module.exports = TimerTray;
```


### Setting Tooltips

Simples, in tray constructor we just set the tooltip string.
```tray.setToolTip('Timer App');```



### Hiding Dock Icons

As we have a system tray icon we don't need a dock icon as well. So we hide it in the app spec.

```
app.on('ready', () => {
    app.dock.hide();
    // ... code ...
});
```

