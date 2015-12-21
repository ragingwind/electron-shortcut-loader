'use strict';

const path = require('path');
const EventEmitter = require('events');
const oassign = require('object-assign');
const Shortcut = require('electron-shortcut').Shortcut;

module.exports = {};

function createShortcut(e, opts) {
	let handler;
	if (typeof opts.event === 'function') {
		handler = function () {
			opts.event({
				shortcut: e,
				event: e
			});
		};
	} else if (typeof opts.handler === 'function') {
		handler = function () {
			opts.handler({
				shortcut: e,
				event: e
			});
		};
	} else {
		handler = function () {
			(opts.handler || require('app')).emit('shortcut-pressed', {
				shortcut: e,
				event: opts.event || e
			});
		};
	}

	return new Shortcut(e, opts, handler);
}

function isHandler(h) {
	return (typeof h === 'function' || h instanceof EventEmitter);
}

class ShortcutLoader {
	constructor() {
		this._shortcuts = [];
	}

	load(input, opts, handler) {
		if (isHandler(opts)) {
			handler = opts;
			opts = {};
		}

		if (handler && !isHandler(handler)) {
			throw new TypeError('Type of event handler is invalid');
		}

		opts = oassign({}, opts);

		if (typeof input === 'string') {
			input = require(path.resolve(path.dirname(module.parent.filename), input));
		}

		if (!input) {
			throw new TypeError('Loading failed for shortcut data');
		}

		// clear before load if it is exist
		if (this._shortcuts.length > 0) {
			this.unregister();
			this._shortcuts = [];
		}

		// register bunch of shortcuts with handler and options
		for (const s of Object.keys(input)) {
			this._shortcuts.push(createShortcut(s, oassign(input[s], opts, {
				handler
			})));
		}

		return this;
	}

	register() {
		for (const event of Object.keys(this._shortcuts)) {
			this._shortcuts[event].register();
		}

		return this;
	}

	unregister() {
		for (const event of Object.keys(this._shortcuts)) {
			this._shortcuts[event].unregister();
		}

		return this;
	}
}

module.exports = (function () {
	let _loader = null;

	ShortcutLoader.load = (input, opts, handler) => {
		if (!_loader) {
			_loader = new ShortcutLoader();
		}

		return _loader.load(input, opts, handler);
	};

	ShortcutLoader.register = () => {
		if (_loader) {
			_loader.register();
		}
	};

	ShortcutLoader.unregister = () => {
		if (_loader) {
			_loader.unregister();
		}
	};

	return ShortcutLoader;
})();
