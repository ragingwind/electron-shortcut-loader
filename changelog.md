0.4.0
==========

	* Re-designed APIs, Sorry for that.
		- Revert autoRegister, instead of `toggle`
		- Deprecated self-event-handler with `on`. It's not anymore delivered from EventEmitter.
	* Using `electron-shortcut`
	* Events
			* Rename the name of event from `pressed` to `shortcut-pressed`
			* Support using anonymous function as event handler
			* Support using the instance derived from `EventEmitter` as event handler
	* Support loading pre-defined shortcut from JSON object
	* Support static methods
	* Deprecated the option per each event, You can use only global options while it loading

0.3.0
==========

	* Using EventEmitter
		- Deprecated that Using `app` as a event listener. but you can still use `addListener` for it
		- Change name of events. `shortcut-press` to `pressed`
		- New events, 'un/register' has been added

0.2.0
==========

	* Supports auto register
