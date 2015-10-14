# electron-shortcut-loader

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
const shortcuts = require('electron-shortcut-loader')('./shortcuts');

app.on('ready', function () {
	shortcuts.register();
});

app.on('will-quit', function () {
	shortcuts.unregister();
});

app.on('shortcut-press', function (e) {
	console.log(e.shortcut, e.event, 'key-event has been fired');
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

- `event`: event name which will be fired to `app` when Shortcut event has been fired
- `cmdOrCtrl`: If your application is running on Windows or Linux? Command or Cmd will be changed to Control or Ctrl

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

## Event

`app` should handle `shortcut-press` event. When the shortcut event has been fired, `event` object will be passed to the `app` event hander with event and shortcut information. see one of the examples.

```js
{
	shortcut: 'Command+?',
	event: 'toggle'
}
```

## License

MIT © [ragingwind](http://ragingwind.me)
