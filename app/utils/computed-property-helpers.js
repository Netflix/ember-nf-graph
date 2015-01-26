var GETKEY_REGEXP = /^([A-Za-z0-9$_\.]*[A-Za-z0-9$_]+)(\.@each|\.\[\])?/;

function parseArguments(args) {
	var handler = args[args.length - 1];
	var observed = [].slice.call(args, 0, args.length - 1);
	var keys = getKeys(observed);
	return {
		handler: handler,
		observed: observed,
		keys: keys
	};
}

function getKeys(observed) {
	return observed.map(function(name) {
    var parts = GETKEY_REGEXP.exec(name);
    if(!parts) {
      return null;
    }
    return parts[1];
  });
}

function shorthandFor(type) {
	return function() {
		var args = parseArguments(arguments);

		var actualHandler = function() {
			var self = this;
			return args.handler.apply(self, args.keys.map(function(key) {
				return self.get(key);
			}));
		};

		return Function.prototype[type].apply(actualHandler, args.observed);
	};
}


export var property = shorthandFor('property');
export var observer = shorthandFor('observes');

export var backedProperty = function(backingField) {
	var fn = function(key, value) {
		if(arguments.length > 1) {
			this[backingField] = value;
		}
		return this[backingField];
	};

	return Function.prototype.property.apply(fn);
};

