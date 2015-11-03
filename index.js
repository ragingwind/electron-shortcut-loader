'use strict';

const path = require('path');
const app = require('app');
const globalShortcut = require('global-shortcut');

function bindKeyEvent(shortcut, event) {
	return function() {
		app.emit('shortcut-press', {
			shortcut: shortcut,
			event: event
		});
	};
}

function ShortcutLoader(input) {
	this.shortcuts = {};

	const pathOfModuleThatLoadedThis = path.dirname(module.parent.filename)
	const pathToInput = path.resolve(pathOfModuleThatLoadedThis, input)
	const shortcuts = require(pathToInput);
	
	if (!shortcuts) {
		throw new Error('Shortcut input has been missing');
	}

	for (let s in shortcuts) {
		if (shortcuts.hasOwnProperty(s)) {
			// check options was given
			const opts = shortcuts[s];
			if (!opts.event) {
				throw new Error('Shortcust has no event');
			} else {

			}

			// change accelerator according to platform
			if (opts.cmdOrCtrl && process.platform !== 'darwin') {
				if (/Command\+/i.test(s)) {
					s = s.replace(/Command/i, 'Control');
				} else if (/Cmd\+/i.test(s)) {
					s = s.replace(/Cmd/i, 'Ctrl');
				}
			}

			this.shortcuts[s] = {
				event: bindKeyEvent(s, opts.event)
			};
		}
	}

	return this;
}

ShortcutLoader.prototype.register = function () {
	for (const s in this.shortcuts) {
		if (this.shortcuts.hasOwnProperty(s)) {
			if (globalShortcut.isRegistered(s)) {
				console.warn(s + ' is already registered');
			}

			globalShortcut.register(s, this.shortcuts[s].event);
		}
	}
};

ShortcutLoader.prototype.unregister = function () {
	for (const s in this.shortcuts) {
		if (this.shortcuts.hasOwnProperty(s)) {
			if (globalShortcut.isRegistered(s)) {
				globalShortcut.unregister(s, this.shortcuts[s].event);
			}
		}
	}
};

module.exports = function (input) {
	return new ShortcutLoader(input);
};
