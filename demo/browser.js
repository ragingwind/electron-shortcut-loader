'use strict';
const ipc = require('ipc');

ipc.on('shortcut-pressed', shortcut => {
	document.querySelector('#shortcut-title').textContent = shortcut;
});

ipc.on('shortcut-status', status => {
	document.querySelector('#shortcut-status').textContent = status;
});
