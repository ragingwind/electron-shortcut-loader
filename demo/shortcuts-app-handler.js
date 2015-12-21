'use strict';

const app = require('app');

module.exports = {
	'Command+1': {
		event: 'Command+1'
	},
	'Command+2': {
		event: 'Command+2'
	},
	'Command+3': {
		event: e => {
			app.emit('Command+3', e);
		}
	}
};
