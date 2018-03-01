const electron = require('electron');
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
    constructor(url){
        super({
            height: 500,
            width: 300,
            resizable: false,
            frame: false,
            show: false,

            // need this to make app run at full speed in the background!
            webPreferences: { backgroundThrottling: false }
        });

        this.loadURL(url);
        this.on('blur', this.onBlur.bind(this));
    }

    onBlur() {
        this.hide();
    }
}

module.exports = MainWindow;
