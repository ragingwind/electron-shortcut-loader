'use strict';
const app = require('app');
const path = require('path');
const BrowserWindow = require('browser-window');
const ShortcutLoader = require('../');
const EventEmitter = require('events');

// report crashes to the Electron project
require('crash-reporter').start({
	companyName: 'github.com/ragingwind',
	submitURL: 'http://github.com/ragingwind/electron-shortcut-loader'
});

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

class ShortcutEventHandler extends EventEmitter {
}

let win;
let loaderWith;
let loaderWithJSON;
const shorcutHandler = new ShortcutEventHandler();

function createMainWindow() {
	win = new BrowserWindow({
		width: 640,
		height: 480,
		webPreferences: {
			'preload': path.join(__dirname, 'browser.js')
		}
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

function sendEventToBroser(key, event, from) {
	win.webContents.send('shortcut-pressed', `${event} by key: ${key}`);
	win.webContents.send('shortcut-status', `${event} has been fired from ${from}`);
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

	// register in manually and using handle event coming from EventEmitter
	ShortcutLoader.load('./shortcuts-app-handler', {});

	loaderWith = new ShortcutLoader();
	loaderWith.load('./shortcuts-cb-handler', {
		autoRegister: false,
		cmdOrCtrl: true
	}, e => {
		sendEventToBroser(e.shortcut, e.event, 'Global anonymous event handler');
	});

	// register in manually
	loaderWith.register();

	// register with JSON data
	loaderWithJSON = new ShortcutLoader();
	loaderWithJSON.load({
		'Command+6': {
			event: 'Command+6'
		},
		'Command+7': {
			event: 'Command+7'
		},
		'Command+8': {
			event: e => {
				sendEventToBroser(e.shortcut, e.event, 'Local anonymous event handler');
			}
		}
	}, shorcutHandler);

	shorcutHandler.on('shortcut-pressed', e => {
		sendEventToBroser(e.shortcut, e.event, 'ShortcutLoader event handler');
	});
});

app.on('will-quit', () => {
	loaderWith.unregister();
});

app.on('shortcut-pressed', e => {
	sendEventToBroser(e.shortcut, e.event, 'app event handler');
});

app.on('Command+3', e => {
	sendEventToBroser(e.shortcut, e.event, 'own event handler with app');
});
