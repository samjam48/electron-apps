const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;
let clearWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New ToDo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

function createClearWindow() {
    clearWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Clear ToDo List'
    });
    clearWindow.loadURL(`file://${__dirname}/clear.html`);
    clearWindow.on('closed', () => clearWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

ipcMain.on('todos:clear', (event) => {
    mainWindow.webContents.send('todos:clear');
    clearWindow.close();
});

ipcMain.on('clearWindow:close', (event) => {
    clearWindow.close();
});

const menuTemplate = [
    {
        label: 'MyFile',
        submenu: [
            { 
                label: 'New To Do',
                accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
                click() { createAddWindow(); }
            },
            { 
                label: 'Clear To Do List',
                accelerator: process.platform === 'darwin' ? 'Command+k' : 'Ctrl+k',
                click() { createClearWindow(); }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() { app.quit(); }
            }
        ]
    }
];

// command to add empty object at start of MenuBar if on Mac OS
if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'DEBUG!!!',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
        ]
       
    })
}
