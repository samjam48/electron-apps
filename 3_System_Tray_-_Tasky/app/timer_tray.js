const electron = require('electron');
const { app, Menu, Tray } = electron;

class TimerTray extends Tray {
    constructor(iconPath, mainWindow){
        super(iconPath);

        this.mainWindow = mainWindow;

        this.setToolTip('Timer App');
        this.on('click', this.onClick.bind(this));
        this.on('right-click', this.onRightClick.bind(this))
    }

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

    onRightClick() {
        const menuConfig = Menu.buildFromTemplate([
            { 
                label: 'Quit',
                click: () => app.quit()
            }
        ]);

        this.popUpContextMenu(menuConfig);
    }
}

module.exports = TimerTray;
