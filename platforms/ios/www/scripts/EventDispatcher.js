function EventTarget() {
    this._listeners = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
    addEventListener: function (type, listener) {
        if (typeof this._listeners[type] == "undefined") {
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
    },
	hasEventListener: function(type) {
		if (this._listeners[type] instanceof Array) {
			return true;
		}
		return false;
	},
    fireEvent: function (event, data) {
		if (typeof event == "string") {
            event = {
                type: event
            };
        }
        if (!event.target) {
            event.target = this;
        }
        if (data != null) {
            event.data = data;
        }
        if (!event.type) {
            throw new Error("Event object missing 'type' property.");
        }
        if (this._listeners[event.type] instanceof Array) {
			var listeners = this._listeners[event.type];
			for (var i = 0, len = listeners.length; i < len; i++) {
				listeners[i].call(this, event);
            }
        }
    },
    removeEventListener: function (type, listener) {
        if (this._listeners[type] instanceof Array) {
            var listeners = this._listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};