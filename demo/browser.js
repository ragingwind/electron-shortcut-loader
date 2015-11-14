'use strict';
const ipc = require('ipc');

ipc.on('shortcut', (shortcut) => {
	document.querySelector('#shortcut-title').textContent = shortcut;
});
