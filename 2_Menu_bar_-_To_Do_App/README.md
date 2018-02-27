# To Do App - Electron App

This is a basic To Do that is actually super shit because the main point is to just learn about the menu bar and opening and closing windows in electron

## Lessons

#### Menu Bar

The menu can be completely replaced from the electron default menu. You can add a tab for development practicalities that gives you access to things like reload and dev tools that a user in production app should not have. most Default properties like this can be easily assigned using the ```role``` keyword.

Mac renders differently to Windows and has a default first tab that has the name of the application. You need to code for this appropriately.

Key binding shortcuts can be easily added to menu items with the ```accelerator``` keyword. Again Mac and Windows are different.


#### Opening and Closing Windows

Windows are easy to open and close from the electron javascript back end. Use IPC to send info from the front to change what is being displayed.

Be careful about declaring your windows at the top of the file so they are available globally in the document and not tied unto sub scoped functions.

when closing a window be sure to clear the variable used for that window to prevent overload of Javascript Garbage. Do this automatically by setting this functionality in the function used to create the window so wherever and whenever you close the window it will always have it's variable cleared.

