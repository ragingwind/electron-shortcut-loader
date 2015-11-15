'use strict';
const app = require('app');
const path = require('path');
const BrowserWindow = require('browser-window');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

var win;
var shortcuts;
const autoRegister = true;

function createMainWindow() {
	 win = new BrowserWindow({
		width: 640,
		height: 480,
		'web-preferences' : {
			'preload': path.join(__dirname, 'browser.js')
		}
	});

	shortcuts = require('../')('./shortcuts', {
		autoRegister: autoRegister
	});

	win.loadUrl(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

	if (!autoRegister) {
		shortcuts.register();
	}
});

app.on('will-quit', function () {
	if (!autoRegister) {
  	shortcuts.unregister();
	}
});

app.on('shortcut-press', function (e) {
	BrowserWindow.getFocusedWindow().webContents.send('shortcut', e.event);
  console.log(e.shortcut, e.event, 'key-event has been fired');
});
