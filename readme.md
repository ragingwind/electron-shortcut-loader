# electron-shortcut-loader [![Build Status](https://travis-ci.org/ragingwind/electron-shortcut-loader.svg?branch=master)](https://travis-ci.org/ragingwind/electron-shortcut-loader)

> Loading predefined shortcuts with events and options


## Install

```
$ npm install --save electron-shortcut-loader
```


## Usage

```js
// predefine shortcuts with events and options in shortcuts.js
'use strict';
module.exports = {
	'Command+A': {
		event: 'select-all'
	},
	'Cmd+Alt+I': {
		event: 'show-devtool',
		cmdOrCtrl: true
	},
	'CommandOrControl+?': {
		event: 'focus'
	},
	'Command+?': {
		event: 'focus',
		cmdOrCtrl: true
	}
};

// app.js
const = shortcuts require('electron-shortcut-loader')('./shortcuts');

app.on('ready', function () {
	shortcuts.register();
});

app.on('will-quit', function () {
	shortcuts.unregister();
});

app.on('shortcut-press', function (e) {
	console.log(e, 'key-event has been fired');
});
```


## API

### electronHotkeyLoader(input)

#### input

Type: `string`

Path of shortcuts file which has sets of shortcuts json data, will be registered by `register` method

### register

Call `globalShortcut.register` in the method with shortcuts loaded from shortcuts file

### unregister

Call `globalShortcut.unregister` in the method when you want

## Structure of shortcuts

Shortcuts file should exports json data with accelerator name and options. accelerator name is the key and options included `event` and `cmdOrCtrl`. Please refer to below code to make up.

```js
// predefine shortcuts with events and options in shortcuts.js
'use strict';
module.exports = {
	'Command+A': {
		event: 'select-all'
	},
	'Cmd+Alt+I': {
		event: 'show-devtool',
		cmdOrCtrl: true
	},
	'CommandOrControl+?': {
		event: 'focus'
	},
	'Command+?': {
		event: 'focus',
		cmdOrCtrl: true
	}
};
```

## License

MIT © [ragingwind](http://ragingwind.me)
