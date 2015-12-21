# electron-shortcut-loader

> Loading pre-defined shortcuts with custom events and more options

![](https://cloud.githubusercontent.com/assets/124117/11163454/1605df60-8b14-11e5-99b6-0ba3006528fb.png)

## Install

```
$ npm install --save electron-shortcut-loader
```


## Usage

ShortcutLoader can load pre-defined shortcuts data from a javascript file with `module.exports` in node

```js
'use strict';

module.exports = {
	'Command+A': {
		event: 'select-all'
	},
	'Cmd+Alt+I': {
		event: 'show-devtool'
	},
	'CommandOrControl+?': {
		event: 'focus'
	},
	'Command+?': {
		event: 'focus'
	},
	'Command+J': {
		event: () => {
			console.log('You can register individual event');
		}
	}
};
```
, or a JSON object in code.

```js
const ShortcutLoader = require('ShortcutLoader');

ShortcutLoader.load({
	'Command+A': {
		event: 'select-all'
	},
	'Cmd+Alt+I': {
		event: 'show-devtool'
	},
});
```

It supports two types of API, `static` and `instance` methods that allow you to manage shortcuts on `global` and `local`. For global, the shortcut loader manage the one instances dealing with static method and on the other hand, You can manage multiple set of shortcuts depending on your purpose. For example, it could be possible that create each shortcut loader per browser window.

Let see how to use static method on global mode.

```js
const ShortcutLoader = require('electron-shortcut-loader');

ShortcutLoader.load('./shortcuts', {
	autoRegister: false,
	cmdOrCtrl: true,
}, app);

// register shortcuts in manually
app.on('ready', function () {
	shortcuts.register();
});

app.on('will-quit', function () {
	shortcuts.unregister();
});

// 'shortcut-pressed' is custom event named from Shortcut Loader
app.on('shortcut-pressed', function (e) {
	console.log(e.shortcut, e.event, 'key-event has been fired');
});
```

, or You can create a instance by hand to create and manage multiple shortcut set.

```js
const loader = new ShortcutLoader();

// with common anonymous function
loader.load('./shortcuts', {
	autoRegister: false,
	cmdOrCtrl: true,
}, (e) =>
	console.log(e.shortcut, e.event, 'key-event has been fired');
});

// You can use `app`, the instance of EventEmitter, as a event handler.
// See demo/index.js for further information.
const loaderWithApp = new ShortcutLoader();
loader.load('./shortcuts2', {
	autoRegister: true,
	cmdOrCtrl: true,
}, app);

// events, registered with loaderWithApp, will be fired with `shortcut-pressed` event through to `app`
app.on('shortcut-pressed', function (e) {
	console.log(e.shortcut, e.event, 'key-event has been fired');
});
```

## API

### ShortcutLoader.load, un/register

Static methods for ShortcutLoader. see below information of APIs for further information.

### ShortcutLoader()

constructor of ShortcutLoader.

#### load(input, [options], handler)

Load shortcuts coming from a file or object.

##### input

Type: `string` or `object`

A path of shortcuts file or JSON data which has the set of shortcuts as JSON data, will be registered by `register` method. __the path will be resolved with path of current module willing to import shortcuts.__ See more detailed structure of JSON data.

##### options

Will be delivered to each shortcut created by `electron-shortcut`. See further information of [options](https://github.com/ragingwind/electron-shortcut#options).

##### handler

Event handler, the instance of `EventEmitter` such as `app` or anonymous function. If is not set, `app` is the default event handler and `shortcut-pressed` is the pre-defined name for event handler.

#### register

shortcuts will be registered.

#### unregister

shortcuts will be unregistered.

## Pre-defined shortcut data

It should consist of accelerator name and event handler. the accelerator name is the key and event handler could be the name of event or anonymous function for an individual event. not allows extra options in a event.

- `event`: event name which will be fired to the instance of `EventEmitter` such as `app` or through to anonymous function. If is not set? will be fired by the name of accelerator

```js
// predefine shortcuts with events and options in shortcuts.js
'use strict';
module.exports = {
	'Command+A': {
		event: 'select-all'
	},
	'Cmd+Alt+I': {},
	'CommandOrControl+?': {
		event: e => {}
	}
};
```

## Event

When a specific shortcut key has been pressed, `event` object pass through to the event handler.  For `EventEmitter` event handler, `shortcut-pressed` is the pre-defined name of the event and you can use the custom event name. If you set anonymous function at event, the `shortcut name` will be used as the name of the event and both of property of `event`, `shortcut` and `event` will be same.

```js
ShortcutLoader.load('Command+A', e => {
	console.log(
		e.shortcut, // the name of accelerator
		e.event // the name of accelerator
	)
});

app.on('shortcut-pressed', e => {
	console.log(
		e.shortcut, // the name of accelerator
		e.event // the custom name for the event or accelerator
	);
})
```

## Run demo

```
$ npm install && npm start
```

## License

MIT © [ragingwind](http://ragingwind.me)
