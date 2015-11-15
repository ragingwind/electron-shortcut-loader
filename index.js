'use strict';

const path = require('path');
const app = require('app');
const globalShortcut = require('global-shortcut');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function bindKeyEvent(emitter, shortcut, event) {
	return function() {
		emitter.emit('pressed', {
			shortcut: shortcut,
			event: event
		});
	};
}

function ShortcutLoader(input, opts) {
	opts = opts || {};

	const shortcuts = require(path.resolve(path.dirname(module.parent.filename), input));
	if (!shortcuts) {
		throw new Error('Shortcut input has been missing');
	}

	// init with shortcuts
	this.shortcuts = {};

	for (let s in shortcuts) {
		if (shortcuts.hasOwnProperty(s)) {
			// check options was given
			const shortcut = shortcuts[s];
			if (!shortcut.event) {
				throw new Error('Shortcust has no event');
			}

			// change accelerator according to platform
			if (shortcut.cmdOrCtrl && process.platform !== 'darwin') {
				if (/Command\+/i.test(s)) {
					s = s.replace(/Command/i, 'Control');
				} else if (/Cmd\+/i.test(s)) {
					s = s.replace(/Cmd/i, 'Ctrl');
				}
			}

			this.shortcuts[s] = {
				event: bindKeyEvent(this, s, shortcut.event)
			};
		}
	}

	// bind focus event for autoRegister
	if (opts.autoRegister) {
		const _this = this;

		app.on('browser-window-focus', (e, win) => {
			console.log('register');

			_this.register();
		});

		app.on('browser-window-blur', (e, win) => {
			_this.unregister();
		});
	}

	return this;
}

util.inherits(ShortcutLoader, EventEmitter);

ShortcutLoader.prototype.register = function () {
	for (const s in this.shortcuts) {
		if (this.shortcuts.hasOwnProperty(s)) {
			if (globalShortcut.isRegistered(s)) {
				console.warn(s + ' is already registered');
			}

			globalShortcut.register(s, this.shortcuts[s].event);
		}
	}

	this.emit('register');
};

ShortcutLoader.prototype.unregister = function () {
	for (const s in this.shortcuts) {
		if (this.shortcuts.hasOwnProperty(s)) {
			if (globalShortcut.isRegistered(s)) {
				globalShortcut.unregister(s, this.shortcuts[s].event);
			}
		}
	}

	this.emit('unregister');
};

module.exports = function (input, opts) {
	return new ShortcutLoader(input, opts);
};
