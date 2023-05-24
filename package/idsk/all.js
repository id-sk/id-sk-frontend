(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory) :
	(factory((global.GOVUKFrontend = {})));
}(this, (function (exports) { 'use strict';

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback);
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

/**
 * Toggle class
 * @param {object} node element
 * @param {string} className to toggle
 */
function toggleClass(node, className) {
    if (node === null) {
        return;
    }

    if (node.className.indexOf(className) > 0) {
        node.className = node.className.replace(' ' + className, '');
    } else {
        node.className += ' ' + className;
    }
}

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach$1(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
function generateUniqueID() {
  var d = new Date().getTime();
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
var detect = ('Window' in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
	(function (global) {
		if (global.constructor) {
			global.Window = global.constructor;
		} else {
			(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
		}
	}(this));
}

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
var detect = ("Document" in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

	if (this.HTMLDocument) { // IE8

		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
		this.Document = this.HTMLDocument;

	} else {

		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
		this.Document.prototype = document;
	}
}


})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
var detect = ('Element' in this && 'HTMLElement' in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
(function () {

	// IE8
	if (window.Element && !window.HTMLElement) {
		window.HTMLElement = window.Element;
		return;
	}

	// create Element constructor
	window.Element = window.HTMLElement = new Function('return function Element() {}')();

	// generate sandboxed iframe
	var vbody = document.appendChild(document.createElement('body'));
	var frame = vbody.appendChild(document.createElement('iframe'));

	// use sandboxed iframe to replicate Element functionality
	var frameDocument = frame.contentWindow.document;
	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
	var cache = {};

	// polyfill Element.prototype on an element
	var shiv = function (element, deep) {
		var
		childNodes = element.childNodes || [],
		index = -1,
		key, value, childNode;

		if (element.nodeType === 1 && element.constructor !== Element) {
			element.constructor = Element;

			for (key in cache) {
				value = cache[key];
				element[key] = value;
			}
		}

		while (childNode = deep && childNodes[++index]) {
			shiv(childNode, deep);
		}

		return element;
	};

	var elements = document.getElementsByTagName('*');
	var nativeCreateElement = document.createElement;
	var interval;
	var loopLimit = 100;

	prototype.attachEvent('onpropertychange', function (event) {
		var
		propertyName = event.propertyName,
		nonValue = !cache.hasOwnProperty(propertyName),
		newValue = prototype[propertyName],
		oldValue = cache[propertyName],
		index = -1,
		element;

		while (element = elements[++index]) {
			if (element.nodeType === 1) {
				if (nonValue || element[propertyName] === oldValue) {
					element[propertyName] = newValue;
				}
			}
		}

		cache[propertyName] = newValue;
	});

	prototype.constructor = Element;

	if (!prototype.hasAttribute) {
		// <Element>.hasAttribute
		prototype.hasAttribute = function hasAttribute(name) {
			return this.getAttribute(name) !== null;
		};
	}

	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
	function bodyCheck() {
		if (!(loopLimit--)) clearTimeout(interval);
		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
			shiv(document, true);
			if (interval && document.body.prototype) clearTimeout(interval);
			return (!!document.body.prototype);
		}
		return false;
	}
	if (!bodyCheck()) {
		document.onreadystatechange = bodyCheck;
		interval = setInterval(bodyCheck, 25);
	}

	// Apply to any new elements created after load
	document.createElement = function createElement(nodeName) {
		var element = nativeCreateElement(String(nodeName).toLowerCase());
		return shiv(element);
	};

	// remove sandboxed iframe
	document.removeChild(vbody);
}());

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
var detect = (
  // In IE8, defineProperty could only act on DOM elements, so full support
  // for the feature requires the ability to set a property on an arbitrary object
  'defineProperty' in Object && (function() {
  	try {
  		var a = {};
  		Object.defineProperty(a, 'test', {value:42});
  		return true;
  	} catch(e) {
  		return false
  	}
  }())
);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
(function (nativeDefineProperty) {

	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

	Object.defineProperty = function defineProperty(object, property, descriptor) {

		// Where native support exists, assume it
		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
			return nativeDefineProperty(object, property, descriptor);
		}

		if (object === null || !(object instanceof Object || typeof object === 'object')) {
			throw new TypeError('Object.defineProperty called on non-object');
		}

		if (!(descriptor instanceof Object)) {
			throw new TypeError('Property description must be an object');
		}

		var propertyString = String(property);
		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
		var getterType = 'get' in descriptor && typeof descriptor.get;
		var setterType = 'set' in descriptor && typeof descriptor.set;

		// handle descriptor.get
		if (getterType) {
			if (getterType !== 'function') {
				throw new TypeError('Getter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			Object.__defineGetter__.call(object, propertyString, descriptor.get);
		} else {
			object[propertyString] = descriptor.value;
		}

		// handle descriptor.set
		if (setterType) {
			if (setterType !== 'function') {
				throw new TypeError('Setter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			Object.__defineSetter__.call(object, propertyString, descriptor.set);
		}

		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
		if ('value' in descriptor) {
			object[propertyString] = descriptor.value;
		}

		return object;
	};
}(Object.defineProperty));
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
var detect = (
  (function(global) {

  	if (!('Event' in global)) return false;
  	if (typeof global.Event === 'function') return true;

  	try {

  		// In IE 9-11, the Event object exists but cannot be instantiated
  		new Event('click');
  		return true;
  	} catch(e) {
  		return false;
  	}
  }(this))
);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
(function () {
	var unlistenableWindowEvents = {
		click: 1,
		dblclick: 1,
		keyup: 1,
		keypress: 1,
		keydown: 1,
		mousedown: 1,
		mouseup: 1,
		mousemove: 1,
		mouseover: 1,
		mouseenter: 1,
		mouseleave: 1,
		mouseout: 1,
		storage: 1,
		storagecommit: 1,
		textinput: 1
	};

	// This polyfill depends on availability of `document` so will not run in a worker
	// However, we asssume there are no browsers with worker support that lack proper
	// support for `Event` within the worker
	if (typeof document === 'undefined' || typeof window === 'undefined') return;

	function indexOf(array, element) {
		var
		index = -1,
		length = array.length;

		while (++index < length) {
			if (index in array && array[index] === element) {
				return index;
			}
		}

		return -1;
	}

	var existingProto = (window.Event && window.Event.prototype) || null;
	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		var event;
		// Shortcut if browser supports createEvent
		if ('createEvent' in document) {
			event = document.createEvent('Event');
			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

			event.initEvent(type, bubbles, cancelable);

			return event;
		}

		event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

		return event;
	};
	if (existingProto) {
		Object.defineProperty(window.Event, 'prototype', {
			configurable: false,
			enumerable: false,
			writable: true,
			value: existingProto
		});
	}

	if (!('createEvent' in document)) {
		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1];

			if (element === window && type in unlistenableWindowEvents) {
				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
			}

			if (!element._events) {
				element._events = {};
			}

			if (!element._events[type]) {
				element._events[type] = function (event) {
					var
					list = element._events[event.type].list,
					events = list.slice(),
					index = -1,
					length = events.length,
					eventElement;

					event.preventDefault = function preventDefault() {
						if (event.cancelable !== false) {
							event.returnValue = false;
						}
					};

					event.stopPropagation = function stopPropagation() {
						event.cancelBubble = true;
					};

					event.stopImmediatePropagation = function stopImmediatePropagation() {
						event.cancelBubble = true;
						event.cancelImmediate = true;
					};

					event.currentTarget = element;
					event.relatedTarget = event.fromElement || null;
					event.target = event.target || event.srcElement || element;
					event.timeStamp = new Date().getTime();

					if (event.clientX) {
						event.pageX = event.clientX + document.documentElement.scrollLeft;
						event.pageY = event.clientY + document.documentElement.scrollTop;
					}

					while (++index < length && !event.cancelImmediate) {
						if (index in events) {
							eventElement = events[index];

							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
								eventElement.call(element, event);
							}
						}
					}
				};

				element._events[type].list = [];

				if (element.attachEvent) {
					element.attachEvent('on' + type, element._events[type]);
				}
			}

			element._events[type].list.push(listener);
		};

		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1],
			index;

			if (element._events && element._events[type] && element._events[type].list) {
				index = indexOf(element._events[type].list, listener);

				if (index !== -1) {
					element._events[type].list.splice(index, 1);

					if (!element._events[type].list.length) {
						if (element.detachEvent) {
							element.detachEvent('on' + type, element._events[type]);
						}
						delete element._events[type];
					}
				}
			}
		};

		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}

			if (!event || typeof event.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}

			var element = this, type = event.type;

			try {
				if (!event.bubbles) {
					event.cancelBubble = true;

					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;

						(element || window).detachEvent('on' + type, cancelBubbleEvent);
					};

					this.attachEvent('on' + type, cancelBubbleEvent);
				}

				this.fireEvent('on' + type, event);
			} catch (error) {
				event.target = element;

				do {
					event.currentTarget = element;

					if ('_events' in element && typeof element._events[type] === 'function') {
						element._events[type].call(element, event);
					}

					if (typeof element['on' + type] === 'function') {
						element['on' + type].call(element, event);
					}

					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
				} while (element && !event.cancelBubble);
			}

			return true;
		};

		// Add the DOMContentLoaded Event
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState === 'complete') {
				document.dispatchEvent(new Event('DOMContentLoaded', {
					bubbles: true
				}));
			}
		});
	}
}());

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
  var detect = 'bind' in Function.prototype;

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
  Object.defineProperty(Function.prototype, 'bind', {
      value: function bind(that) { // .length is 1
          // add necessary es5-shim utilities
          var $Array = Array;
          var $Object = Object;
          var ObjectPrototype = $Object.prototype;
          var ArrayPrototype = $Array.prototype;
          var Empty = function Empty() {};
          var to_string = ObjectPrototype.toString;
          var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
          var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
          var array_slice = ArrayPrototype.slice;
          var array_concat = ArrayPrototype.concat;
          var array_push = ArrayPrototype.push;
          var max = Math.max;
          // /add necessary es5-shim utilities

          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isCallable(target)) {
              throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var bound;
          var binder = function () {

              if (this instanceof bound) {
                  // 15.3.4.5.2 [[Construct]]
                  // When the [[Construct]] internal method of a function object,
                  // F that was created using the bind function is called with a
                  // list of arguments ExtraArgs, the following steps are taken:
                  // 1. Let target be the value of F's [[TargetFunction]]
                  //   internal property.
                  // 2. If target has no [[Construct]] internal method, a
                  //   TypeError exception is thrown.
                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Construct]] internal
                  //   method of target providing args as the arguments.

                  var result = target.apply(
                      this,
                      array_concat.call(args, array_slice.call(arguments))
                  );
                  if ($Object(result) === result) {
                      return result;
                  }
                  return this;

              } else {
                  // 15.3.4.5.1 [[Call]]
                  // When the [[Call]] internal method of a function object, F,
                  // which was created using the bind function is called with a
                  // this value and a list of arguments ExtraArgs, the following
                  // steps are taken:
                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
                  //   property.
                  // 3. Let target be the value of F's [[TargetFunction]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Call]] internal method
                  //   of target providing boundThis as the this value and
                  //   providing args as the arguments.

                  // equiv: target.call(this, ...boundArgs, ...args)
                  return target.apply(
                      that,
                      array_concat.call(args, array_slice.call(arguments))
                  );

              }

          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
              array_push.call(boundArgs, '$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

          if (target.prototype) {
              Empty.prototype = target.prototype;
              bound.prototype = new Empty();
              // Clean up dangling references.
              Empty.prototype = null;
          }

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
      }
  });
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

var KEY_SPACE = 32;
var DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

function Button ($module) {
  this.$module = $module;
  this.debounceFormSubmitTimer = null;
}

/**
* JavaScript 'shim' to trigger the click event of element(s) when the space key is pressed.
*
* Created since some Assistive Technologies (for example some Screenreaders)
* will tell a user to press space on a 'button', so this functionality needs to be shimmed
* See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
*
* @param {object} event event
*/
Button.prototype.handleKeyDown = function (event) {
  // get the target element
  var target = event.target;
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (target.getAttribute('role') === 'button' && event.keyCode === KEY_SPACE) {
    event.preventDefault();
    // trigger the target's click event
    target.click();
  }
};

/**
* If the click quickly succeeds a previous click then nothing will happen.
* This stops people accidentally causing multiple form submissions by
* double clicking buttons.
*/
Button.prototype.debounce = function (event) {
  var target = event.target;
  // Check the button that is clicked on has the preventDoubleClick feature enabled
  if (target.getAttribute('data-prevent-double-click') !== 'true') {
    return
  }

  // If the timer is still running then we want to prevent the click from submitting the form
  if (this.debounceFormSubmitTimer) {
    event.preventDefault();
    return false
  }

  this.debounceFormSubmitTimer = setTimeout(function () {
    this.debounceFormSubmitTimer = null;
  }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
};

/**
* Initialise an event listener for keydown at document level
* this will help listening for later inserted elements with a role="button"
*/
Button.prototype.init = function () {
  this.$module.addEventListener('keydown', this.handleKeyDown);
  this.$module.addEventListener('click', this.debounce);
};

/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 */

var KEY_ENTER = 13;
var KEY_SPACE$1 = 32;

// Create a flag to know if the browser supports navtive details
var NATIVE_DETAILS = typeof document.createElement('details').open === 'boolean';

function Details ($module) {
  this.$module = $module;
}

/**
* Handle cross-modal click events
* @param {object} node element
* @param {function} callback function
*/
Details.prototype.handleInputs = function (node, callback) {
  node.addEventListener('keypress', function (event) {
    var target = event.target;
    // When the key gets pressed - check if it is enter or space
    if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE$1) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        event.preventDefault();
        // Click to let the click event do all the necessary action
        if (target.click) {
          target.click();
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event);
        }
      }
    }
  });

  // Prevent keyup to prevent clicking twice in Firefox when using space key
  node.addEventListener('keyup', function (event) {
    var target = event.target;
    if (event.keyCode === KEY_SPACE$1) {
      if (target.nodeName.toLowerCase() === 'summary') {
        event.preventDefault();
      }
    }
  });

  node.addEventListener('click', callback);
};

Details.prototype.init = function () {
  var $module = this.$module;

  if (!$module) {
    return
  }

  // Save shortcuts to the inner summary and content elements
  var $summary = this.$summary = $module.getElementsByTagName('summary').item(0);
  var $content = this.$content = $module.getElementsByTagName('div').item(0);

  // If <details> doesn't have a <summary> and a <div> representing the content
  // it means the required HTML structure is not met so the script will stop
  if (!$summary || !$content) {
    return
  }

  // If the content doesn't have an ID, assign it one now
  // which we'll need for the summary's aria-controls assignment
  if (!$content.id) {
    $content.id = 'details-content-' + generateUniqueID();
  }

  // Add ARIA role="group" to details
  $module.setAttribute('role', 'group');

  // Add role=button to summary
  $summary.setAttribute('role', 'button');

  // Add aria-controls
  $summary.setAttribute('aria-controls', $content.id);

  // Set tabIndex so the summary is keyboard accessible for non-native elements
  //
  // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
  // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.
  if (!NATIVE_DETAILS) {
    $summary.tabIndex = 0;
  }

  // Detect initial open state
  var openAttr = $module.getAttribute('open') !== null;
  if (openAttr === true) {
    $summary.setAttribute('aria-expanded', 'true');
    $content.setAttribute('aria-hidden', 'false');
  } else {
    $summary.setAttribute('aria-expanded', 'false');
    $content.setAttribute('aria-hidden', 'true');
    if (!NATIVE_DETAILS) {
      $content.style.display = 'none';
    }
  }

  // Bind an event to handle summary elements
  this.handleInputs($summary, this.setAttributes.bind(this));
};

/**
* Define a statechange function that updates aria-expanded and style.display
* @param {object} summary element
*/
Details.prototype.setAttributes = function () {
  var $module = this.$module;
  var $summary = this.$summary;
  var $content = this.$content;

  var expanded = $summary.getAttribute('aria-expanded') === 'true';
  var hidden = $content.getAttribute('aria-hidden') === 'true';

  $summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'));
  $content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'));

  if (!NATIVE_DETAILS) {
    $content.style.display = (expanded ? 'none' : '');

    var hasOpenAttr = $module.getAttribute('open') !== null;
    if (!hasOpenAttr) {
      $module.setAttribute('open', 'open');
    } else {
      $module.removeAttribute('open');
    }
  }
  return true
};

/**
* Remove the click event from the node element
* @param {object} node element
*/
Details.prototype.destroy = function (node) {
  node.removeEventListener('keypress');
  node.removeEventListener('keyup');
  node.removeEventListener('click');
};

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
    var detect = (
      'DOMTokenList' in this && (function (x) {
        return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
      })(document.createElement('x'))
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
    (function (global) {
      var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

      if (
          !nativeImpl ||
          (
            !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
            !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
          )
        ) {
        global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
          var dpSupport = true;
          var defineGetter = function (object, name, fn, configurable) {
            if (Object.defineProperty)
              Object.defineProperty(object, name, {
                configurable: false === dpSupport ? true : !!configurable,
                get: fn
              });

            else object.__defineGetter__(name, fn);
          };

          /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
          try {
            defineGetter({}, "support");
          }
          catch (e) {
            dpSupport = false;
          }


          var _DOMTokenList = function (el, prop) {
            var that = this;
            var tokens = [];
            var tokenMap = {};
            var length = 0;
            var maxLength = 0;
            var addIndexGetter = function (i) {
              defineGetter(that, i, function () {
                preop();
                return tokens[i];
              }, false);

            };
            var reindex = function () {

              /** Define getter functions for array-like access to the tokenList's contents. */
              if (length >= maxLength)
                for (; maxLength < length; ++maxLength) {
                  addIndexGetter(maxLength);
                }
            };

            /** Helper function called at the start of each class method. Internal use only. */
            var preop = function () {
              var error;
              var i;
              var args = arguments;
              var rSpace = /\s+/;

              /** Validate the token/s passed to an instance method, if any. */
              if (args.length)
                for (i = 0; i < args.length; ++i)
                  if (rSpace.test(args[i])) {
                    error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
                    error.code = 5;
                    error.name = "InvalidCharacterError";
                    throw error;
                  }


              /** Split the new value apart by whitespace*/
              if (typeof el[prop] === "object") {
                tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
              } else {
                tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
              }

              /** Avoid treating blank strings as single-item token lists */
              if ("" === tokens[0]) tokens = [];

              /** Repopulate the internal token lists */
              tokenMap = {};
              for (i = 0; i < tokens.length; ++i)
                tokenMap[tokens[i]] = true;
              length = tokens.length;
              reindex();
            };

            /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
            preop();

            /** Return the number of tokens in the underlying string. Read-only. */
            defineGetter(that, "length", function () {
              preop();
              return length;
            });

            /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
            that.toLocaleString =
              that.toString = function () {
                preop();
                return tokens.join(" ");
              };

            that.item = function (idx) {
              preop();
              return tokens[idx];
            };

            that.contains = function (token) {
              preop();
              return !!tokenMap[token];
            };

            that.add = function () {
              preop.apply(that, args = arguments);

              for (var args, token, i = 0, l = args.length; i < l; ++i) {
                token = args[i];
                if (!tokenMap[token]) {
                  tokens.push(token);
                  tokenMap[token] = true;
                }
              }

              /** Update the targeted attribute of the attached element if the token list's changed. */
              if (length !== tokens.length) {
                length = tokens.length >>> 0;
                if (typeof el[prop] === "object") {
                  el[prop].baseVal = tokens.join(" ");
                } else {
                  el[prop] = tokens.join(" ");
                }
                reindex();
              }
            };

            that.remove = function () {
              preop.apply(that, args = arguments);

              /** Build a hash of token names to compare against when recollecting our token list. */
              for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
                ignore[args[i]] = true;
                delete tokenMap[args[i]];
              }

              /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
              for (i = 0; i < tokens.length; ++i)
                if (!ignore[tokens[i]]) t.push(tokens[i]);

              tokens = t;
              length = t.length >>> 0;

              /** Update the targeted attribute of the attached element. */
              if (typeof el[prop] === "object") {
                el[prop].baseVal = tokens.join(" ");
              } else {
                el[prop] = tokens.join(" ");
              }
              reindex();
            };

            that.toggle = function (token, force) {
              preop.apply(that, [token]);

              /** Token state's being forced. */
              if (undefined !== force) {
                if (force) {
                  that.add(token);
                  return true;
                } else {
                  that.remove(token);
                  return false;
                }
              }

              /** Token already exists in tokenList. Remove it, and return FALSE. */
              if (tokenMap[token]) {
                that.remove(token);
                return false;
              }

              /** Otherwise, add the token and return TRUE. */
              that.add(token);
              return true;
            };

            return that;
          };

          return _DOMTokenList;
        }());
      }

      // Add second argument to native DOMTokenList.toggle() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.toggle('x', false);
        if (!e.classList.contains('x')) return;
        e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
          var force = arguments[1];
          if (force === undefined) {
            var add = !this.contains(token);
            this[add ? 'add' : 'remove'](token);
            return add;
          }
          force = !!force;
          this[force ? 'add' : 'remove'](token);
          return force;
        };
      }());

      // Add multiple arguments to native DOMTokenList.add() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.add('a', 'b');
        if (e.classList.contains('b')) return;
        var native = e.classList.constructor.prototype.add;
        e.classList.constructor.prototype.add = function () {
          var args = arguments;
          var l = arguments.length;
          for (var i = 0; i < l; i++) {
            native.call(this, args[i]);
          }
        };
      }());

      // Add multiple arguments to native DOMTokenList.remove() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.add('a');
        e.classList.add('b');
        e.classList.remove('a', 'b');
        if (!e.classList.contains('b')) return;
        var native = e.classList.constructor.prototype.remove;
        e.classList.constructor.prototype.remove = function () {
          var args = arguments;
          var l = arguments.length;
          for (var i = 0; i < l; i++) {
            native.call(this, args[i]);
          }
        };
      }());

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
    var detect = (
      'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
        var e = document.createElement('span');
        e.classList.add('a', 'b');
        return e.classList.contains('b');
      }())
    );

    if (detect) return

    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always
    (function (global) {
      var dpSupport = true;
      var defineGetter = function (object, name, fn, configurable) {
        if (Object.defineProperty)
          Object.defineProperty(object, name, {
            configurable: false === dpSupport ? true : !!configurable,
            get: fn
          });

        else object.__defineGetter__(name, fn);
      };
      /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
      try {
        defineGetter({}, "support");
      }
      catch (e) {
        dpSupport = false;
      }
      /** Polyfills a property with a DOMTokenList */
      var addProp = function (o, name, attr) {

        defineGetter(o.prototype, name, function () {
          var tokenList;

          var THIS = this,

          /** Prevent this from firing twice for some reason. What the hell, IE. */
          gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
          if(THIS[gibberishProperty]) return tokenList;
          THIS[gibberishProperty] = true;

          /**
           * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
           *
           * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
           * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
           * element instead, this would conflict with element types which use indexed properties (such as forms and
           * select lists).
           */
          if (false === dpSupport) {

            var visage;
            var mirror = addProp.mirror || document.createElement("div");
            var reflections = mirror.childNodes;
            var l = reflections.length;

            for (var i = 0; i < l; ++i)
              if (reflections[i]._R === THIS) {
                visage = reflections[i];
                break;
              }

            /** Couldn't find an element's reflection inside the mirror. Materialise one. */
            visage || (visage = mirror.appendChild(document.createElement("div")));

            tokenList = DOMTokenList.call(visage, THIS, attr);
          } else tokenList = new DOMTokenList(THIS, attr);

          defineGetter(THIS, name, function () {
            return tokenList;
          });
          delete THIS[gibberishProperty];

          return tokenList;
        }, true);
      };

      addProp(global.Element, "classList", "className");
      addProp(global.HTMLElement, "classList", "className");
      addProp(global.HTMLLinkElement, "relList", "rel");
      addProp(global.HTMLAnchorElement, "relList", "rel");
      addProp(global.HTMLAreaElement, "relList", "rel");
    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function CharacterCount ($module) {
  this.$module = $module;
  this.$textarea = $module.querySelector('.govuk-js-character-count');
}

CharacterCount.prototype.defaults = {
  characterCountAttribute: 'data-maxlength',
  wordCountAttribute: 'data-maxwords'
};

// Initialize component
CharacterCount.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  var $textarea = this.$textarea;
  if (!$textarea) {
    return
  }

  // Read options set using dataset ('data-' values)
  this.options = this.getDataset($module);

  // Determine the limit attribute (characters or words)
  var countAttribute = this.defaults.characterCountAttribute;
  if (this.options.maxwords) {
    countAttribute = this.defaults.wordCountAttribute;
  }

  // Save the element limit
  this.maxLength = $module.getAttribute(countAttribute);

  // Check for limit
  if (!this.maxLength) {
    return
  }

  // Generate and reference message
  var boundCreateCountMessage = this.createCountMessage.bind(this);
  this.countMessage = boundCreateCountMessage();

  // If there's a maximum length defined and the count message exists
  if (this.countMessage) {
    // Remove hard limit if set
    $module.removeAttribute('maxlength');

    // Bind event changes to the textarea
    var boundChangeEvents = this.bindChangeEvents.bind(this);
    boundChangeEvents();

    // Update count message
    var boundUpdateCountMessage = this.updateCountMessage.bind(this);
    boundUpdateCountMessage();
  }
};

// Read data attributes
CharacterCount.prototype.getDataset = function (element) {
  var dataset = {};
  var attributes = element.attributes;
  if (attributes) {
    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      var match = attribute.name.match(/^data-(.+)/);
      if (match) {
        dataset[match[1]] = attribute.value;
      }
    }
  }
  return dataset
};

// Counts characters or words in text
CharacterCount.prototype.count = function (text) {
  var length;
  if (this.options.maxwords) {
    var tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars
    length = tokens.length;
  } else {
    length = text.length;
  }
  return length
};

// Generate count message and bind it to the input
// returns reference to the generated element
CharacterCount.prototype.createCountMessage = function () {
  var countElement = this.$textarea;
  var elementId = countElement.id;
  // Check for existing info count message
  var countMessage = document.getElementById(elementId + '-info');
  // If there is no existing info count message we add one right after the field
  if (elementId && !countMessage) {
    countElement.insertAdjacentHTML('afterend', '<span id="' + elementId + '-info" class="govuk-hint govuk-character-count__message" aria-live="polite"></span>');
    this.describedBy = countElement.getAttribute('aria-describedby');
    this.describedByInfo = this.describedBy + ' ' + elementId + '-info';
    countElement.setAttribute('aria-describedby', this.describedByInfo);
    countMessage = document.getElementById(elementId + '-info');
  } else {
  // If there is an existing info count message we move it right after the field
    countElement.insertAdjacentElement('afterend', countMessage);
  }
  return countMessage
};

// Bind input propertychange to the elements and update based on the change
CharacterCount.prototype.bindChangeEvents = function () {
  var $textarea = this.$textarea;
  $textarea.addEventListener('keyup', this.checkIfValueChanged.bind(this));

  // Bind focus/blur events to start/stop polling
  $textarea.addEventListener('focus', this.handleFocus.bind(this));
  $textarea.addEventListener('blur', this.handleBlur.bind(this));
};

// Speech recognition software such as Dragon NaturallySpeaking will modify the
// fields by directly changing its `value`. These changes don't trigger events
// in JavaScript, so we need to poll to handle when and if they occur.
CharacterCount.prototype.checkIfValueChanged = function () {
  if (!this.$textarea.oldValue) this.$textarea.oldValue = '';
  if (this.$textarea.value !== this.$textarea.oldValue) {
    this.$textarea.oldValue = this.$textarea.value;
    var boundUpdateCountMessage = this.updateCountMessage.bind(this);
    boundUpdateCountMessage();
  }
};

// Update message box
CharacterCount.prototype.updateCountMessage = function () {
  var countElement = this.$textarea;
  var options = this.options;
  var countMessage = this.countMessage;

  // Determine the remaining number of characters/words
  var currentLength = this.count(countElement.value);
  var maxLength = this.maxLength;
  var remainingNumber = maxLength - currentLength;

  // Set threshold if presented in options
  var thresholdPercent = options.threshold ? options.threshold : 0;
  var thresholdValue = maxLength * thresholdPercent / 100;
  if (thresholdValue > currentLength) {
    countMessage.classList.add('govuk-character-count__message--disabled');
    // Ensure threshold is hidden for users of assistive technologies
    countMessage.setAttribute('aria-hidden', true);
  } else {
    countMessage.classList.remove('govuk-character-count__message--disabled');
    // Ensure threshold is visible for users of assistive technologies
    countMessage.removeAttribute('aria-hidden');
  }

  // Update styles
  if (remainingNumber < 0) {
    countElement.classList.add('govuk-textarea--error');
    countMessage.classList.remove('govuk-hint');
    countMessage.classList.add('govuk-error-message');
  } else {
    countElement.classList.remove('govuk-textarea--error');
    countMessage.classList.remove('govuk-error-message');
    countMessage.classList.add('govuk-hint');
  }

  // Update message
  var charVerb = 'remaining';
  var charNoun = 'character';
  var displayNumber = remainingNumber;
  if (options.maxwords) {
    charNoun = 'word';
  }
  charNoun = charNoun + ((remainingNumber === -1 || remainingNumber === 1) ? '' : 's');

  charVerb = (remainingNumber < 0) ? 'too many' : 'remaining';
  displayNumber = Math.abs(remainingNumber);

  countMessage.innerHTML = 'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb;
};

CharacterCount.prototype.handleFocus = function () {
  // Check if value changed on focus
  this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1000);
};

CharacterCount.prototype.handleBlur = function () {
  // Cancel value checking on blur
  clearInterval(this.valueChecker);
};

function Checkboxes ($module) {
  this.$module = $module;
  this.$inputs = $module.querySelectorAll('input[type="checkbox"]');
}

Checkboxes.prototype.init = function () {
  var $module = this.$module;
  var $inputs = this.$inputs;

  /**
  * Loop over all items with [data-controls]
  * Check if they have a matching conditional reveal
  * If they do, assign attributes.
  **/
  nodeListForEach$1($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls');

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls);
    $input.removeAttribute('data-aria-controls');
    this.setAttributes($input);
  }.bind(this));

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this));
};

Checkboxes.prototype.setAttributes = function ($input) {
  var inputIsChecked = $input.checked;
  $input.setAttribute('aria-expanded', inputIsChecked);

  var $content = this.$module.querySelector('#' + $input.getAttribute('aria-controls'));
  if ($content) {
    $content.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
  }
};

Checkboxes.prototype.handleClick = function (event) {
  var $target = event.target;
  // If a checkbox with aria-controls, handle click
  var isCheckbox = $target.getAttribute('type') === 'checkbox';
  var hasAriaControls = $target.getAttribute('aria-controls');
  if (isCheckbox && hasAriaControls) {
    this.setAttributes($target);
  }
};

(function(undefined) {

  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/detect.js
  var detect = (
    'document' in this && "matches" in document.documentElement
  );

  if (detect) return

  // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/polyfill.js
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {
    var element = this;
    var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
    var index = 0;

    while (elements[index] && elements[index] !== element) {
      ++index;
    }

    return !!elements[index];
  };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/detect.js
  var detect = (
    'document' in this && "closest" in document.documentElement
  );

  if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/polyfill.js
  Element.prototype.closest = function closest(selector) {
    var node = this;

    while (node) {
      if (node.matches(selector)) return node;
      else node = 'SVGElement' in window && node instanceof SVGElement ? node.parentNode : node.parentElement;
    }

    return null;
  };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function ErrorSummary ($module) {
  this.$module = $module;
}

ErrorSummary.prototype.init = function () {
  var $module = this.$module;
  if (!$module) {
    return
  }
  $module.focus();

  $module.addEventListener('click', this.handleClick.bind(this));
};

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target;
  if (this.focusTarget(target)) {
    event.preventDefault();
  }
};

/**
 * Focus the target element
 *
 * By default, the browser will scroll the target into view. Because our labels
 * or legends appear above the input, this means the user will be presented with
 * an input without any context, as the label or legend will be off the top of
 * the screen.
 *
 * Manually handling the click event, scrolling the question into view and then
 * focussing the element solves this.
 *
 * This also results in the label and/or legend being announced correctly in
 * NVDA (as tested in 2018.3.2) - without this only the field type is announced
 * (e.g. "Edit, has autocomplete").
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */
ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false
  }

  var inputId = this.getFragmentFromUrl($target.href);
  var $input = document.getElementById(inputId);
  if (!$input) {
    return false
  }

  var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
  if (!$legendOrLabel) {
    return false
  }

  // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  $legendOrLabel.scrollIntoView();
  $input.focus({ preventScroll: true });

  return true
};

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash) from a URL, but not including
 * the hash.
 *
 * @param {string} url - URL
 * @returns {string} Fragment from URL, without the hash
 */
ErrorSummary.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false
  }

  return url.split('#').pop()
};

/**
 * Get associated legend or label
 *
 * Returns the first element that exists from this list:
 *
 * - The `<legend>` associated with the closest `<fieldset>` ancestor
 * - The first `<label>` that is associated with the input using for="inputId"
 * - The closest parent `<label>`
 *
 * @param {HTMLElement} $input - The input
 * @returns {HTMLElement} Associated legend or label, or null if no associated
 *                        legend or label can be found
 */
ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
  var $fieldset = $input.closest('fieldset');

  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend');

    if (legends.length) {
      return legends[0]
    }
  }

  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") ||
    $input.closest('label')
};

function Radios ($module) {
  this.$module = $module;
}

Radios.prototype.init = function () {
  var $module = this.$module;
  var $inputs = $module.querySelectorAll('input[type="radio"]');

  /**
  * Loop over all items with [data-controls]
  * Check if they have a matching conditional reveal
  * If they do, assign attributes.
  **/
  nodeListForEach$1($inputs, function ($input) {
    var controls = $input.getAttribute('data-aria-controls');

    // Check if input controls anything
    // Check if content exists, before setting attributes.
    if (!controls || !$module.querySelector('#' + controls)) {
      return
    }

    // If we have content that is controlled, set attributes.
    $input.setAttribute('aria-controls', controls);
    $input.removeAttribute('data-aria-controls');
    this.setAttributes($input);
  }.bind(this));

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this));
};

Radios.prototype.setAttributes = function ($input) {
  var $content = document.querySelector('#' + $input.getAttribute('aria-controls'));

  if ($content && $content.classList.contains('govuk-radios__conditional')) {
    var inputIsChecked = $input.checked;

    $input.setAttribute('aria-expanded', inputIsChecked);

    $content.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
  }
};

Radios.prototype.handleClick = function (event) {
  var $clickedInput = event.target;
  // We only want to handle clicks for radio inputs
  if ($clickedInput.type !== 'radio') {
    return
  }
  // Because checking one radio can uncheck a radio in another $module,
  // we need to call set attributes on all radios in the same form, or document if they're not in a form.
  //
  // We also only want radios which have aria-controls, as they support conditional reveals.
  var $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
  nodeListForEach$1($allInputs, function ($input) {
    // Only inputs with the same form owner should change.
    var hasSameFormOwner = ($input.form === $clickedInput.form);

    // In radios, only radios with the same name will affect each other.
    var hasSameName = ($input.name === $clickedInput.name);
    if (hasSameName && hasSameFormOwner) {
      this.setAttributes($input);
    }
  }.bind(this));
};

function initCore(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  var $buttons = scope.querySelectorAll('[data-module="govuk-button"]');
  nodeListForEach$1($buttons, function ($button) {
    new Button($button).init();
  });

  var $details = scope.querySelectorAll('[data-module="govuk-details"]');
  nodeListForEach$1($details, function ($detail) {
    new Details($detail).init();
  });

  var $characterCounts = scope.querySelectorAll('[data-module="govuk-character-count"]');
  nodeListForEach$1($characterCounts, function ($characterCount) {
    new CharacterCount($characterCount).init();
  });

  var $checkboxes = scope.querySelectorAll('[data-module="govuk-checkboxes"]');
  nodeListForEach$1($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init();
  });

  // Find first error summary module to enhance.
  var $errorSummary = scope.querySelector('[data-module="govuk-error-summary"]');
  new ErrorSummary($errorSummary).init();

  var $radios = scope.querySelectorAll('[data-module="govuk-radios"]');
  nodeListForEach$1($radios, function ($radio) {
    new Radios($radio).init();
  });
}

var KEY_SPACE$2 = 32;
var DEBOUNCE_TIMEOUT_IN_SECONDS$1 = 1;

function Button$1 ($module) {
  this.$module = $module;
  this.debounceFormSubmitTimer = null;
}

/**
* JavaScript 'shim' to trigger the click event of element(s) when the space key is pressed.
*
* Created since some Assistive Technologies (for example some Screenreaders)
* will tell a user to press space on a 'button', so this functionality needs to be shimmed
* See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
*
* @param {object} event event
*/
Button$1.prototype.handleKeyDown = function (event) {
  // get the target element
  var target = event.target;
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (target.getAttribute('role') === 'button' && event.keyCode === KEY_SPACE$2) {
    event.preventDefault();
    // trigger the target's click event
    target.click();
  }
};

/**
* If the click quickly succeeds a previous click then nothing will happen.
* This stops people accidentally causing multiple form submissions by
* double clicking buttons.
*/
Button$1.prototype.debounce = function (event) {
  var target = event.target;
  // Check the button that is clicked on has the preventDoubleClick feature enabled
  if (target.getAttribute('data-prevent-double-click') !== 'true') {
    return
  }

  // If the timer is still running then we want to prevent the click from submitting the form
  if (this.debounceFormSubmitTimer) {
    event.preventDefault();
    return false
  }

  this.debounceFormSubmitTimer = setTimeout(function () {
    this.debounceFormSubmitTimer = null;
  }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS$1 * 1000);
};

/**
* Initialise an event listener for keydown at document level
* this will help listening for later inserted elements with a role="button"
*/
Button$1.prototype.init = function () {
  this.$module.addEventListener('keydown', this.handleKeyDown);
  this.$module.addEventListener('click', this.debounce);
};

/**
 * Footer for extended websites
 */
function FooterExtended($module) {
    this.$module = $module;
}

FooterExtended.prototype.init = function () {
    var $module = this.$module;
    // check for module
    if (!$module) {
        return;
    }

    var $yesButton = $module.querySelector('#idsk-footer-extended-feedback-yes-button');
    var $noButton = $module.querySelector('#idsk-footer-extended-feedback-no-button');
    var $errorButton = $module.querySelector('#idsk-footer-extended-error-button');
    var $closeErrorFormButton = $module.querySelector('#idsk-footer-extended-close-error-form-button');
    var $closeHelpFormButton = $module.querySelector('#idsk-footer-extended-close-help-form-button');
    var $textAreaCharacterCount = $module.querySelector('#idsk-footer-extended-error-form #with-hint');
    var $submitErrorButton = $module.querySelector('#submit-button-error-form');
    var $writeUsButton = $module.querySelector('#idsk-footer-extended-write-us-button');
    var $upButton = $module.querySelector("#footer-extended-up-button");

    if ($yesButton && $noButton) {
        $yesButton.addEventListener('click', this.handleYesButtonClick.bind(this));
        $noButton.addEventListener('click', this.handleNoButtonClick.bind(this));
    }

    if ($errorButton) {
        $errorButton.addEventListener('click', this.handleErrorButtonClick.bind(this));
    }

    if ($writeUsButton) {
        $writeUsButton.addEventListener('click', this.handleErrorButtonClick.bind(this));
    }

    if ($closeHelpFormButton) {
        $closeHelpFormButton.addEventListener('click', this.handleCloseHelpFormButtonClick.bind(this));
    }

    if ($closeErrorFormButton) {
        $closeErrorFormButton.addEventListener('click', this.handleCloseErrorFormButtonClick.bind(this));
    }

    if ($submitErrorButton) {
        $submitErrorButton.addEventListener('click', this.handleSubmitButtonClick.bind(this));
    }

    if ($textAreaCharacterCount) {
        $textAreaCharacterCount.addEventListener('input', this.handleStatusOfCharacterCountButton.bind(this));
    }

    //Get the button
    // When the user scrolls down window screen heiht From the top of the document, show the button
    if ($upButton != null) {
        window.addEventListener('scroll', this.scrollFunction.bind(this));
    }


};


FooterExtended.prototype.handleSubmitButtonClick = function (e) {
    var $noOption = this.$module.querySelector('#idsk-footer-extended-help-form');
    var $errorOption = this.$module.querySelector('#idsk-footer-extended-error-form');
    var $infoQuestion = this.$module.querySelector('#idsk-footer-extended-info-question');
    var $heartSymbol = this.$module.querySelector('#idsk-footer-extended-heart');
    var $feedbackQuestion = this.$module.querySelector('#idsk-footer-extended-feedback');
    var $helpAndErrorContainer = this.$module.querySelector('#idsk-footer-extended-feedback-content');

    toggleClass($helpAndErrorContainer, 'idsk-footer-extended-feedback-content');
    $noOption.classList.add('idsk-footer-extended-display-hidden');
    $errorOption.classList.add('idsk-footer-extended-display-hidden');
    $noOption.classList.remove('idsk-footer-extended-open');
    $errorOption.classList.remove('idsk-footer-extended-open');

    toggleClass($infoQuestion, 'idsk-footer-extended-heart');
    toggleClass($heartSymbol, 'idsk-footer-extended-heart-visible');
    toggleClass($feedbackQuestion, 'idsk-footer-extended-display-none');

    var $selection = this.$module.querySelector('#sort');
    var $issueTextArea = this.$module.querySelector('#with-hint');
    var $feedbackInfo = this.$module.querySelector('.idsk-footer-extended__feedback-info');

    var selectedOption = $selection.value;
    var issueText = $issueTextArea.value;

    if($feedbackInfo) {
        var email = $feedbackInfo.getAttribute("data-email");
        var subject = $feedbackInfo.getAttribute("data-subject");
        var emailBody = $feedbackInfo.textContent;
        emailBody = emailBody.replace("%issue%", selectedOption).replace("%description%", issueText);
        document.location = "mailto:"+email+"?subject="+subject+"&body="+encodeURIComponent(emailBody);
    }
};

FooterExtended.prototype.handleStatusOfCharacterCountButton = function (e) {
    var $textAreaCharacterCount = this.$module.querySelector('#with-hint');
    var $remainingCharacterCountMessage = this.$module.querySelector('#with-hint-info');

    var $submitButton = this.$module.querySelector('#submit-button-error-form');

    setTimeout(function () {
        if ($textAreaCharacterCount.classList.contains('govuk-textarea--error') || $remainingCharacterCountMessage.classList.contains('govuk-error-message')) {
            $submitButton.disabled = true;
        } else {
            $submitButton.disabled = false;
        }
    }, 300);
};


//Hiding feedback question text and showing thank notice with heart
FooterExtended.prototype.handleYesButtonClick = function (e) {
    var $noOption = this.$module.querySelector('#idsk-footer-extended-help-form');
    var $errorOption = this.$module.querySelector('#idsk-footer-extended-error-form');
    var $infoQuestion = this.$module.querySelector('#idsk-footer-extended-info-question');
    var $heartSymbol = this.$module.querySelector('#idsk-footer-extended-heart');

    $noOption.classList.add('idsk-footer-extended-display-hidden');
    $errorOption.classList.add('idsk-footer-extended-display-hidden');

    toggleClass($infoQuestion, 'idsk-footer-extended-heart');
    toggleClass($heartSymbol, 'idsk-footer-extended-heart-visible');
};


//Hiding feedback question element and showing help form with animation
FooterExtended.prototype.handleNoButtonClick = function (e) {
    var $helpOption = this.$module.querySelector('#idsk-footer-extended-help-form');
    var $feedbackQuestion = this.$module.querySelector('#idsk-footer-extended-feedback');

    var $helpAndErrorContainer = this.$module.querySelector('#idsk-footer-extended-feedback-content');

    toggleClass($helpAndErrorContainer, 'idsk-footer-extended-feedback-content');
    toggleClass($feedbackQuestion, 'idsk-footer-extended-display-none');
    toggleClass($helpOption, 'idsk-footer-extended-display-hidden');
    toggleClass($helpOption, 'idsk-footer-extended-open');
};

//Hiding feedback question element and showing error form with animation
FooterExtended.prototype.handleErrorButtonClick = function (e) {
    var $errorOption = this.$module.querySelector('#idsk-footer-extended-error-form');
    var $helpOption = this.$module.querySelector('#idsk-footer-extended-help-form');
    var $feedbackQuestion = this.$module.querySelector('#idsk-footer-extended-feedback');

    var $helpAndErrorContainer = this.$module.querySelector('#idsk-footer-extended-feedback-content');

    toggleClass($helpAndErrorContainer, 'idsk-footer-extended-feedback-content');
    toggleClass($feedbackQuestion, 'idsk-footer-extended-display-none');
    $helpOption.classList.add('idsk-footer-extended-display-hidden');
    $helpOption.classList.remove('idsk-footer-extended-open');
    toggleClass($errorOption, 'idsk-footer-extended-display-hidden');
    toggleClass($errorOption, 'idsk-footer-extended-open');
};

//Hiding error form with animation and showing feedback question element
FooterExtended.prototype.handleCloseErrorFormButtonClick = function (e) {
    var $errorOption = this.$module.querySelector('#idsk-footer-extended-error-form');
    var $feedbackQuestion = this.$module.querySelector('#idsk-footer-extended-feedback');
    var $helpAndErrorContainer = this.$module.querySelector('#idsk-footer-extended-feedback-content');

    toggleClass($helpAndErrorContainer, 'idsk-footer-extended-feedback-content');
    toggleClass($feedbackQuestion, 'idsk-footer-extended-display-none');
    toggleClass($errorOption, 'idsk-footer-extended-open');
    toggleClass($errorOption, 'idsk-footer-extended-display-hidden');
};

//Hiding help form with animation and showing feedback question element
FooterExtended.prototype.handleCloseHelpFormButtonClick = function () {
    var $helpOption = this.$module.querySelector('#idsk-footer-extended-help-form');
    var $feedbackQuestion = this.$module.querySelector('#idsk-footer-extended-feedback');
    var $helpAndErrorContainer = this.$module.querySelector('#idsk-footer-extended-feedback-content');

    toggleClass($helpAndErrorContainer, 'idsk-footer-extended-feedback-content');
    toggleClass($feedbackQuestion, 'idsk-footer-extended-display-none');
    toggleClass($helpOption, 'idsk-footer-extended-open');
    toggleClass($helpOption, 'idsk-footer-extended-display-hidden');
};

FooterExtended.prototype.scrollFunction = function () {
    var $upButton = this.$module.querySelector("#footer-extended-up-button");

    if (window.innerWidth > 768 && (document.body.scrollTop > window.screen.height || document.documentElement.scrollTop > window.screen.height)) {
        $upButton.style.display = "block";
    } else {
        $upButton.style.display = "none";
    }
};

function CharacterCount$1($module) {
  this.$module = $module;
  this.$textarea = $module.querySelector('.govuk-js-character-count');
}

CharacterCount$1.prototype.defaults = {
  characterCountAttribute: 'data-maxlength',
  wordCountAttribute: 'data-maxwords'
};

// Initialize component
CharacterCount$1.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  var $textarea = this.$textarea;
  if (!$textarea) {
    return
  }

  // Read options set using dataset ('data-' values)
  this.options = this.getDataset($module);

  // Determine the limit attribute (characters or words)
  var countAttribute = this.defaults.characterCountAttribute;
  if (this.options.maxwords) {
    countAttribute = this.defaults.wordCountAttribute;
  }

  // Save the element limit
  this.maxLength = $module.getAttribute(countAttribute);

  // Check for limit
  if (!this.maxLength) {
    return
  }

  // Generate and reference message
  var boundCreateCountMessage = this.createCountMessage.bind(this);
  this.countMessage = boundCreateCountMessage();

  // If there's a maximum length defined and the count message exists
  if (this.countMessage) {
    // Remove hard limit if set
    $module.removeAttribute('maxlength');

    // Bind event changes to the textarea
    var boundChangeEvents = this.bindChangeEvents.bind(this);
    boundChangeEvents();

    // Update count message
    var boundUpdateCountMessage = this.updateCountMessage.bind(this);
    boundUpdateCountMessage();
  }
};

// Read data attributes
CharacterCount$1.prototype.getDataset = function (element) {
  var dataset = {};
  var attributes = element.attributes;
  if (attributes) {
    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      var match = attribute.name.match(/^data-(.+)/);
      if (match) {
        dataset[match[1]] = attribute.value;
      }
    }
  }
  return dataset
};

// Counts characters or words in text
CharacterCount$1.prototype.count = function (text) {
  var length;
  if (this.options.maxwords) {
    var tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars
    length = tokens.length;
  } else {
    length = text.length;
  }
  return length
};

// Generate count message and bind it to the input
// returns reference to the generated element
CharacterCount$1.prototype.createCountMessage = function () {
  var countElement = this.$textarea;
  var elementId = countElement.id;
  // Check for existing info count message
  var countMessage = document.getElementById(elementId + '-info');
  // If there is no existing info count message we add one right after the field
  if (elementId && !countMessage) {
    countElement.insertAdjacentHTML('afterend', '<span id="' + elementId + '-info" class="govuk-hint govuk-character-count__message" aria-live="polite"></span>');
    this.describedBy = countElement.getAttribute('aria-describedby');
    this.describedByInfo = this.describedBy + ' ' + elementId + '-info';
    countElement.setAttribute('aria-describedby', this.describedByInfo);
    countMessage = document.getElementById(elementId + '-info');
  } else {
    // If there is an existing info count message we move it right after the field
    countElement.insertAdjacentElement('afterend', countMessage);
  }
  return countMessage
};

// Bind input propertychange to the elements and update based on the change
CharacterCount$1.prototype.bindChangeEvents = function () {
  var $textarea = this.$textarea;
  $textarea.addEventListener('keyup', this.checkIfValueChanged.bind(this));

  // Bind focus/blur events to start/stop polling
  $textarea.addEventListener('focus', this.handleFocus.bind(this));
  $textarea.addEventListener('blur', this.handleBlur.bind(this));
};

// Speech recognition software such as Dragon NaturallySpeaking will modify the
// fields by directly changing its `value`. These changes don't trigger events
// in JavaScript, so we need to poll to handle when and if they occur.
CharacterCount$1.prototype.checkIfValueChanged = function () {
  if (!this.$textarea.oldValue) this.$textarea.oldValue = '';
  if (this.$textarea.value !== this.$textarea.oldValue) {
    this.$textarea.oldValue = this.$textarea.value;
    var boundUpdateCountMessage = this.updateCountMessage.bind(this);
    boundUpdateCountMessage();
  }
};

// Update message box
CharacterCount$1.prototype.updateCountMessage = function () {
  var countElement = this.$textarea;
  var options = this.options;
  var countMessage = this.countMessage;

  // Determine the remaining number of characters/words
  var currentLength = this.count(countElement.value);
  var maxLength = this.maxLength;
  var remainingNumber = maxLength - currentLength;

  // Set threshold if presented in options
  var thresholdPercent = options.threshold ? options.threshold : 0;
  var thresholdValue = maxLength * thresholdPercent / 100;
  if (thresholdValue > currentLength) {
    countMessage.classList.add('govuk-character-count__message--disabled');
    // Ensure threshold is hidden for users of assistive technologies
    countMessage.setAttribute('aria-hidden', true);
  } else {
    countMessage.classList.remove('govuk-character-count__message--disabled');
    // Ensure threshold is visible for users of assistive technologies
    countMessage.removeAttribute('aria-hidden');
  }

  // Update styles
  if (remainingNumber < 0) {
    countElement.classList.add('govuk-textarea--error');
    countMessage.classList.remove('govuk-hint');
    countMessage.classList.add('govuk-error-message');
  } else {
    countElement.classList.remove('govuk-textarea--error');
    countMessage.classList.remove('govuk-error-message');
    countMessage.classList.add('govuk-hint');
  }
  var charNoun = 'znak';
  var displayNumber = remainingNumber;
  if (options.maxwords) {
    charNoun = 'slov';
  }

  if ((remainingNumber > 1 && remainingNumber < 5) || (remainingNumber > -5 && remainingNumber < -1)) {
    charNoun = charNoun + 'y';
  } else if (remainingNumber == 1 || remainingNumber == -1) { } else {
    charNoun = charNoun + 'ov';
  }

  displayNumber = Math.abs(remainingNumber);
  if (remainingNumber < 0) {
    displayNumber = '-' + displayNumber;
    countMessage.innerHTML = 'Prekročili ste maximálny počet znakov';
  } else {
    countMessage.innerHTML = 'Zostáva Vám ' + displayNumber + ' ' + charNoun + ' ';
  }
};

CharacterCount$1.prototype.handleFocus = function () {
  // Check if value changed on focus
  this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1000);
};

CharacterCount$1.prototype.handleBlur = function () {
  // Cancel value checking on blur
  clearInterval(this.valueChecker);
};

function CustomerSurveys($module) {
    this.$module = $module;
}

CustomerSurveys.prototype.init = function () {
    var $module = this.$module;
    var $nextButton = $module.querySelector('#idsk-customer-surveys__send-button');
    var $previousButton = $module.querySelector('#idsk-customer-surveys__previous-button');
    var $textAreaFirst = $module.querySelector('.idsk-customer-surveys-text-area #first');
    var $textAreaSecond = $module.querySelector('.idsk-customer-surveys-text-area #second');
    var $textAreaThird = $module.querySelector('.idsk-customer-surveys-text-area #third');
    var $textAreaFourth = $module.querySelector('.idsk-customer-surveys-text-area #fourth');
    var $radioButtonWork = $module.querySelector('.idsk-customer-survey__radio--work');
    var $radioButtonPrivate = $module.querySelector('.idsk-customer-survey__radio--private');
    var $counter = 7;
    $module.sendButtonDisabled = new Array(7);
    $module.textAreaMap = new Map();

    if (!$module) {
        return;
    }

    this.handleCounterOfSubtitles.call(this, $counter);
    this.enableNextButtonForAllSteps.call(this);

    if ($radioButtonWork) {
        $radioButtonWork.addEventListener('click', this.handleRadioButtonWorkClick.bind(this));
    }

    if ($radioButtonPrivate) {
        $radioButtonPrivate.addEventListener('click', this.handleRadioButtonPrivateClick.bind(this));
    }

    if ($nextButton) {
        $nextButton.addEventListener('click', this.handleNextButtonClick.bind(this));
    }

    if ($previousButton) {
        $previousButton.addEventListener('click', this.handlePreviousButtonClick.bind(this));
    }

    if ($textAreaFirst) {
        $module.textAreaMap.set('first', 1);
        $textAreaFirst.addEventListener('input', this.handleStatusOfCharacterCountButton.bind(this));
    }

    if ($textAreaSecond) {
        $module.textAreaMap.set('second', 2);
        $textAreaSecond.addEventListener('input', this.handleStatusOfCharacterCountButton.bind(this));
    }

    if ($textAreaThird) {
        $module.textAreaMap.set('third', 4);
        $textAreaThird.addEventListener('input', this.handleStatusOfCharacterCountButton.bind(this));
    }

    if ($textAreaFourth) {
        $module.textAreaMap.set('fourth', 5);
        $textAreaFourth.addEventListener('input', this.handleStatusOfCharacterCountButton.bind(this));
    }
};
CustomerSurveys.prototype.enableNextButtonForAllSteps = function (e) {
    for (var index = 0; index < this.$module.sendButtonDisabled.length; index++) {
        this.$module.sendButtonDisabled[index] = false;
    }
};

CustomerSurveys.prototype.handleStatusOfCharacterCountButton = function (e) {
    var $module = this.$module;
    var $name = e.srcElement.id;
    var $textAreaCharacterCount = $module.querySelector('#' + $name);
    var $remainingCharacterCountMessage = $module.querySelector('#' + $name + '-info');
    var $submitButton = $module.querySelector('#idsk-customer-surveys__send-button');

    setTimeout(function () {
        if ($textAreaCharacterCount.classList.contains('govuk-textarea--error') || $remainingCharacterCountMessage.classList.contains('govuk-error-message')) {
            $submitButton.disabled = true;
        } else {
            $submitButton.disabled = false;
            // changing value of global variable for disabling button, in case of walk through steps and comming back to this textarea.
            $module.sendButtonDisabled[$module.textAreaMap.get($name)] = false;
        }
    }, 300);
};

CustomerSurveys.prototype.handleCounterOfSubtitles = function ($counter) {
    var $subtitles = this.$module.querySelectorAll('.idsk-customer-surveys--subtitle');
    var i;

    // remove previous indexing, cause amount of steps could change
    // adding new indexing
    for (i = 0; i < $counter; i++) {
        $subtitles[i].textContent = $subtitles[i].textContent.substring(3);
        $subtitles[i].innerHTML = (i + 1) + '. ' + $subtitles[i].textContent;
    }
};

CustomerSurveys.prototype.handleRadioButtonWorkClick = function (e) {
    var $textArea = this.$module.querySelector('.idsk-customer-survey__text-area--work');
    var $subtitle = this.$module.querySelector('.idsk-customer-survey__subtitle--work');

    $subtitle.classList.add('idsk-customer-surveys--subtitle');
    $textArea.classList.remove('idsk-customer-surveys--hidden');
    this.handleCounterOfSubtitles.call(this, 8);
};

CustomerSurveys.prototype.clearTextArea = function ($textArea) {
    var $text = $textArea.querySelector('.govuk-textarea');
    var $hint = $textArea.querySelector('.govuk-character-count__message');

    $text.value = "";
    if ($text.classList.contains('govuk-textarea--error')) {
        $text.classList.remove('govuk-textarea--error');
        $hint.classList.remove('govuk-error-message');
        $hint.classList.add('govuk-hint');
        $hint.innerHTML = $textArea.dataset.lines;
    }
};

CustomerSurveys.prototype.handleRadioButtonPrivateClick = function (e) {
    var $textArea = this.$module.querySelector('.idsk-customer-survey__text-area--work');
    var $subtitle = this.$module.querySelector('.idsk-customer-survey__subtitle--work');
    var $nextButton = this.$module.querySelector('#idsk-customer-surveys__send-button');

    $nextButton.disabled = false;
    $subtitle.classList.remove('idsk-customer-surveys--subtitle');
    $textArea.classList.add('idsk-customer-surveys--hidden');
    this.clearTextArea.call(this, $textArea);
    this.handleCounterOfSubtitles.call(this, 7);
};

CustomerSurveys.prototype.handlePreviousButtonClick = function (e) {
    var $module = this.$module;
    var $steps = $module.querySelectorAll('.idsk-customer-surveys__step');
    var i;
    var $nextButton = $module.querySelector('#idsk-customer-surveys__send-button');
    var $previousButton = $module.querySelector('#idsk-customer-surveys__previous-button');
    var $startIcon = $module.querySelectorAll('.idsk-button__start-icon');
    var $nextButtonText = $module.querySelector('.idsk-customer-surveys__send-button');

    $previousButton.blur();
    // showing and hiding steps, once step is set to be showed return is called.
    // changing names of buttons, disabling
    for (i = 1; i < $steps.length - 1; i++) {
        if ($previousButton.textContent == $previousButton.dataset.line2 && $steps[1].classList.contains('idsk-customer-surveys--show')) {
            $previousButton.innerHTML = $previousButton.dataset.line1;
            $nextButtonText.innerHTML = $nextButtonText.dataset.line1;
            toggleClass($startIcon[0], 'idsk-customer-surveys__icon--hidden');
            $previousButton.onclick = function () {
                location.href = "/";
            };
        }
        if ($nextButtonText.textContent.includes($nextButtonText.dataset.line3)) {
            $nextButtonText.innerHTML = $nextButtonText.dataset.line2;
            $nextButton.setAttribute('type', 'button');
            toggleClass($startIcon[0], 'idsk-customer-surveys__icon--hidden');
        }
        if ($steps[i].classList.contains('idsk-customer-surveys--show')) {
            if ($nextButton.disabled) {
                $module.sendButtonDisabled[i] = true;
                $nextButton.disabled = false;
            }
            $steps[i].classList.remove('idsk-customer-surveys--show');
            toggleClass($steps[i], 'idsk-customer-surveys--hidden');
            toggleClass($steps[i - 1], 'idsk-customer-surveys--hidden');
            $steps[i - 1].classList.add('idsk-customer-surveys--show');
            return;
        }
    }};

CustomerSurveys.prototype.handleNextButtonClick = function (e) {
    var $module = this.$module;
    var $steps = $module.querySelectorAll('.idsk-customer-surveys__step');
    var i;
    var $buttonsDiv = $module.querySelector('.idsk-customer-surveys__buttons');
    var $nextButton = $module.querySelector('#idsk-customer-surveys__send-button');
    var $previousButton = $module.querySelector('#idsk-customer-surveys__previous-button');
    var $startIcon = $module.querySelectorAll('.idsk-button__start-icon');
    var $nextButtonText = $module.querySelector('.idsk-customer-surveys__send-button');

    $nextButton.blur();
    if ($nextButtonText.textContent.includes($nextButtonText.dataset.line1)) {
        $nextButtonText.innerHTML = $nextButtonText.dataset.line2;
        toggleClass($startIcon[0], 'idsk-customer-surveys__icon--hidden');
        // uncheck all radiobuttons 
        this.handleRadioButtonPrivateClick.call(this);

        var $radios = $module.querySelectorAll('.govuk-radios__input');
        for (var i = 0; i < $radios.length; i++) {
            $radios[i].checked = false;
        }
        // clear all textAreas
        var $textAreas = $module.querySelectorAll('.idsk-customer-surveys-text-area');
        for (var i = 0; i < $textAreas.length; i++) {
            this.clearTextArea.call(this, $textAreas[i]);
        }
        this.enableNextButtonForAllSteps.call(this);
    }

    if ($nextButtonText.textContent.includes($nextButtonText.dataset.line3)) {
        $buttonsDiv.classList.add('idsk-customer-surveys--hidden');
    }

    // showing and hiding steps, once step is set to be showed return is called.
    // changing names of buttons, disabling
    for (i = 0; i < $steps.length - 1; i++) {
        if ($steps[i].classList.contains('idsk-customer-surveys--show')) {
            if ($module.sendButtonDisabled[i + 1]) {
                $nextButton.disabled = true;
            } else {
                $nextButton.disabled = false;
            }
            $steps[i].classList.remove('idsk-customer-surveys--show');
            toggleClass($steps[i], 'idsk-customer-surveys--hidden');
            toggleClass($steps[i + 1], 'idsk-customer-surveys--hidden');
            $steps[i + 1].classList.add('idsk-customer-surveys--show');
            if (i == 4) {
                $nextButtonText.innerHTML = $nextButtonText.dataset.line3;
                setTimeout(function () {
                    $nextButton.setAttribute('type', 'submit');
                }, 500);
                toggleClass($startIcon[0], 'idsk-customer-surveys__icon--hidden');
            }
            if (i == 0) {
                $previousButton.innerHTML = $previousButton.dataset.line2;
                $previousButton.onclick = function () {
                    location.href = "#";
                };
            }
            return;
        }
    }};

/**
 * Header for web websites
 */
function HeaderWeb($module) {
    this.$module = $module;
}

HeaderWeb.prototype.init = function () {

    var $module = this.$module;
    // check for module
    if (!$module) {
        return;
    }

    // check for banner
    var $banner = $module.querySelector('.idsk-header-web__banner');
    this.$lastScrollTopPosition = 0;

    if ($banner) {
      document.addEventListener('scroll', this.handleToggleBanner.bind(this));
    }

    // check for close banner button
    var $bannerCloseBtn = $module.querySelector('.idsk-header-web__banner-close');

    if ($bannerCloseBtn) {
        $bannerCloseBtn.addEventListener('click', this.handleCloseBanner.bind(this));
    }

    // check for language switcher
    this.$languageBtn = $module.querySelector('.idsk-header-web__brand-language-button');

    if (this.$languageBtn) {
        // Handle esc button press
        var $languageSwitcher = $module.querySelector('.idsk-header-web__brand-language');
        $languageSwitcher.addEventListener('keydown', this.languegeEscPressed.bind(this));

        // Handle $languageBtn click events
        this.$languageBtn.addEventListener('click', this.handleLanguageSwitcherClick.bind(this));

        // close language list if i left the last item from langauge list e.g. if user use tab key for navigations
        var $lastLanguageItems = $module.querySelectorAll('.idsk-header-web__brand-language-list-item:last-child .idsk-header-web__brand-language-list-item-link');
        nodeListForEach($lastLanguageItems, function ($lastLanguageItem) {
            $lastLanguageItem.addEventListener('blur', this.checkBlurLanguageSwitcherClick.bind(this));
        }.bind(this));

        // close language list if user back tabbing
        this.$languageBtn.addEventListener('keydown', this.handleBackTabbing.bind(this));
    }

    $module.boundCheckBlurLanguageSwitcherClick = this.checkBlurLanguageSwitcherClick.bind(this);

    // check for e-goverment button
    var $eGovermentButtons = $module.querySelectorAll('.idsk-header-web__brand-gestor-button');
    this.$eGovermentSpacer = $module.querySelector('.idsk-header-web__brand-spacer');
    if ($eGovermentButtons.length > 0) {
        // Handle $eGovermentButton click event
        nodeListForEach($eGovermentButtons, function ($eGovermentButton) {
            $eGovermentButton.addEventListener('click', this.handleEgovermentClick.bind(this));
        }.bind(this));
    }

    // check for menu items
    var $menuList = $module.querySelector('.idsk-header-web__nav-list');
    var $menuItems = $module.querySelectorAll('.idsk-header-web__nav-list-item-link');
    if ($menuItems && $menuList) {
        // Handle $menuItem click events
        nodeListForEach($menuItems, function ($menuItem) {
            $menuItem.addEventListener('click', this.handleSubmenuClick.bind(this));
            if($menuItem.parentElement.querySelector('.idsk-header-web__nav-submenu') || $menuItem.parentElement.querySelector('.idsk-header-web__nav-submenulite')){
                $menuItem.parentElement.lastElementChild.addEventListener('keydown', this.menuTabbing.bind(this));
            }
        }.bind(this));
        $module.addEventListener('keydown', this.navEscPressed.bind(this));
    }

    // check for mobile menu button
    this.$menuButton = $module.querySelector('.idsk-header-web__main-headline-menu-button');
    if (this.$menuButton) {
        this.$menuButton.addEventListener('click', this.showMobileMenu.bind(this));
        this.menuBtnText = this.$menuButton.innerText.trim();
        this.initMobileMenuTabbing();
    }

    $module.boundCheckBlurMenuItemClick = this.checkBlurMenuItemClick.bind(this);
};

/**
 * Handle toggle banner on scrolling
 * @param {object} e
 */
HeaderWeb.prototype.handleToggleBanner = function (e) {
    // ignore if mobile menu is open
    if (!this.$module.querySelector('.idsk-header-web__nav--mobile')) {
      return false;
    }

    var $scrollTop = window.pageYOffset || document.scrollTop;
    if ($scrollTop > this.$lastScrollTopPosition) {
      this.$module.querySelector('.idsk-header-web__banner').classList.add("idsk-header-web__banner--scrolled");
    } else if ($scrollTop < this.$lastScrollTopPosition) {
      this.$module.querySelector('.idsk-header-web__banner').classList.remove("idsk-header-web__banner--scrolled");
    }

    // $scrollTop is not used, because element idsk-header-web__banner change height of header
    this.$lastScrollTopPosition = window.pageYOffset || document.scrollTop;
};

/**
 * Handle close banner
 * @param {object} e
 */
 HeaderWeb.prototype.handleCloseBanner = function (e) {
    var $closeButton = e.target || e.srcElement;
    var $banner = $closeButton.closest('.idsk-header-web__banner');
    $banner.classList.add('idsk-header-web__banner--hide');
};

/**
 * Handle open/hide language switcher
 * @param {object} e
 */
HeaderWeb.prototype.handleLanguageSwitcherClick = function (e) {
    var $toggleButton = e.target || e.srcElement;
    this.$activeSearch = $toggleButton.closest('.idsk-header-web__brand-language');
    toggleClass(this.$activeSearch, 'idsk-header-web__brand-language--active');
    if(this.$activeSearch.classList.contains('idsk-header-web__brand-language--active')){
        this.$activeSearch.firstElementChild.setAttribute('aria-expanded', 'true');
        this.$activeSearch.firstElementChild.setAttribute('aria-label',  this.$activeSearch.firstElementChild.getAttribute('data-text-for-hide'));
    }else{
        this.$activeSearch.firstElementChild.setAttribute('aria-expanded', 'false');
        this.$activeSearch.firstElementChild.setAttribute('aria-label',  this.$activeSearch.firstElementChild.getAttribute('data-text-for-show'));
    }
    document.addEventListener('click', this.$module.boundCheckBlurLanguageSwitcherClick, true);
};

HeaderWeb.prototype.checkBlurLanguageSwitcherClick = function (e) {
    if(!(e.target.classList.contains('idsk-header-web__brand-language-button'))){
        this.$activeSearch.classList.remove('idsk-header-web__brand-language--active');
        this.$activeSearch.firstElementChild.setAttribute('aria-expanded', 'false');
        this.$activeSearch.firstElementChild.setAttribute('aria-label',  this.$activeSearch.firstElementChild.getAttribute('data-text-for-show'));
        document.removeEventListener('click', this.$module.boundCheckBlurLanguageSwitcherClick, true);
    }
};

HeaderWeb.prototype.handleBackTabbing = function (e) {
    //shift was down when tab was pressed
    if(e.shiftKey && e.keyCode == 9 && document.activeElement == this.$languageBtn) {
        // this.handleLanguageSwitcherClick(e);
    }
};

HeaderWeb.prototype.languegeEscPressed = function (e) {
    if(e.key === "Escape" && this.$languageBtn.getAttribute('aria-expanded') == 'true') {
        this.handleLanguageSwitcherClick(e);
    }
};

/**
 * Handle open/hide e-goverment statement
 * @param {object} e
 */
 HeaderWeb.prototype.handleEgovermentClick = function (e) {
    var $eGovermentButtons = this.$module.querySelectorAll('.idsk-header-web__brand-gestor-button');
    var $eGovermentDropdown = this.$module.querySelector('.idsk-header-web__brand-dropdown');
    toggleClass($eGovermentDropdown, 'idsk-header-web__brand-dropdown--active');
    toggleClass(this.$eGovermentSpacer, 'idsk-header-web__brand-spacer--active');
    nodeListForEach($eGovermentButtons, function ($eGovermentButton) {
        toggleClass($eGovermentButton, 'idsk-header-web__brand-gestor-button--active');
        if($eGovermentButton.classList.contains('idsk-header-web__brand-gestor-button--active')){
            $eGovermentButton.setAttribute('aria-expanded', 'true');
            $eGovermentButton.setAttribute('aria-label', $eGovermentButton.getAttribute('data-text-for-hide'));
        }else{
            $eGovermentButton.setAttribute('aria-expanded', 'false');
            $eGovermentButton.setAttribute('aria-label', $eGovermentButton.getAttribute('data-text-for-show'));
        }
    }.bind(this));
};

/**
 * Handle open/hide submenu
 * @param {object} e
 */
HeaderWeb.prototype.handleSubmenuClick = function (e) {
    var $srcEl = e.target || e.srcElement;
    var $toggleButton = $srcEl.closest('.idsk-header-web__nav-list-item');
    var $currActiveItem = this.$module.querySelector('.idsk-header-web__nav-list-item--active');

    if($currActiveItem && $currActiveItem.isEqualNode($toggleButton)){
        $currActiveItem.classList.remove('idsk-header-web__nav-list-item--active');
        if($toggleButton.childNodes[3]){
          $currActiveItem.childNodes[1].setAttribute('aria-expanded', 'false');
        $toggleButton.childNodes[1].setAttribute('aria-label', $toggleButton.childNodes[1].getAttribute('data-text-for-show'));
        }
    }else{
        if($currActiveItem){
            $currActiveItem.classList.remove('idsk-header-web__nav-list-item--active');
        }
        toggleClass($toggleButton, 'idsk-header-web__nav-list-item--active');

        if($toggleButton.childNodes[3] && $toggleButton.classList.contains('idsk-header-web__nav-list-item--active')) {
            $toggleButton.childNodes[1].setAttribute('aria-expanded', 'true');
            $toggleButton.childNodes[1].setAttribute('aria-label', $toggleButton.childNodes[1].getAttribute('data-text-for-hide'));
            if (window.screen.width <= 768){
              $toggleButton.scrollIntoView({behavior: 'smooth'});
            }
        }
    }

    document.addEventListener('click', this.$module.boundCheckBlurMenuItemClick.bind(this), true);
};

/**
 * Remove active class from menu when user leaves menu with tabbing
 */
 HeaderWeb.prototype.menuTabbing = function (e) {
    var isTabPressed = (e.key === 'Tab' || e.keyCode === 9);

    if (!isTabPressed) {
        return;
    }

    var $submenuList = e.srcElement.parentElement.parentElement;
    var $activeItem = $submenuList.closest('.idsk-header-web__nav-list-item');
    // shift + tab
    if (e.shiftKey) {
        if (document.activeElement === $submenuList.firstElementChild.firstElementChild) {
            $activeItem.classList.remove('idsk-header-web__nav-list-item--active');
            $activeItem.childNodes[1].setAttribute('aria-expanded', 'false');
            $activeItem.childNodes[1].setAttribute('aria-label', $activeItem.childNodes[1].getAttribute('data-text-for-show'));
        }
    // tab
    } else if (document.activeElement === $submenuList.lastElementChild.lastElementChild) {
        $activeItem.classList.remove('idsk-header-web__nav-list-item--active');
        $activeItem.childNodes[1].setAttribute('aria-expanded', 'false');
        $activeItem.childNodes[1].setAttribute('aria-label', $activeItem.childNodes[1].getAttribute('data-text-for-show'));
    }
};

/**
 * Remove active class from menu when user leaves menu with esc
 */
 HeaderWeb.prototype.navEscPressed = function (e) {
    if(e.key === "Escape") {
        var $menuList = e.srcElement.parentElement.parentElement;
        if($menuList.classList.contains('idsk-header-web__nav-submenulite-list') || $menuList.classList.contains('idsk-header-web__nav-submenu-list')){
            $menuList = $menuList.closest('.idsk-header-web__nav-list');
        }
        var $activeItem = $menuList.querySelector('.idsk-header-web__nav-list-item--active');
        if($activeItem) {
            $activeItem.classList.remove('idsk-header-web__nav-list-item--active');
            $activeItem.childNodes[1].setAttribute('aria-expanded', 'false');
            $activeItem.childNodes[1].setAttribute('aria-label', $activeItem.childNodes[1].getAttribute('data-text-for-show'));
            $activeItem.childNodes[1].focus();
        } else if(this.$menuButton.getAttribute('aria-expanded') == 'true') {
            // Hide mobile menu if navigation is not active
            this.showMobileMenu();
        }
    }
 };

/**
 * handle click outside menu or "blur" the item link
 */
HeaderWeb.prototype.checkBlurMenuItemClick = function (e) {
    var $currActiveItem = this.$module.querySelector('.idsk-header-web__nav-list-item--active');
    if($currActiveItem && !(e.target.classList.contains('idsk-header-web__nav-list-item-link'))){
        $currActiveItem.classList.remove('idsk-header-web__nav-list-item--active');
        if( $currActiveItem.childNodes[3] ){
           $currActiveItem.childNodes[1].setAttribute('aria-expanded', 'false');
           $currActiveItem.childNodes[1].setAttribute('aria-label', $currActiveItem.childNodes[1].getAttribute('data-text-for-show'));
        }
        document.removeEventListener('click', this.$module.boundCheckBlurMenuItemClick, true);
    }
};

/**
 * Show mobile menu
 * @param {object} e
 */
HeaderWeb.prototype.showMobileMenu = function () {
    var closeText = this.$menuButton.getAttribute('data-text-for-close') ? this.$menuButton.getAttribute('data-text-for-close') : '';
    var $mobileMenu = this.$module.querySelector('.idsk-header-web__nav');
    toggleClass($mobileMenu, 'idsk-header-web__nav--mobile');
    toggleClass(this.$menuButton, 'idsk-header-web__main-headline-menu-button--active');
    if(!this.$menuButton.classList.contains('idsk-header-web__main-headline-menu-button--active')){
        this.$menuButton.setAttribute('aria-expanded', 'false');
        this.$menuButton.setAttribute('aria-label', this.$menuButton.getAttribute('data-text-for-show'));
    }else{
        this.$menuButton.setAttribute('aria-expanded', 'true');
        this.$menuButton.setAttribute('aria-label', this.$menuButton.getAttribute('data-text-for-hide'));
    }
    var buttonIsActive = this.$menuButton.classList.contains('idsk-header-web__main-headline-menu-button--active');

    this.$menuButton.childNodes[0].nodeValue = buttonIsActive ? closeText : this.menuBtnText;
};

/**
 * Create loop in mobile menu for tabbing elements
 */
 HeaderWeb.prototype.initMobileMenuTabbing = function () {
     var $menuItems = this.$module.querySelector('.idsk-header-web__nav');
     var $focusableElements = Array.from($menuItems.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'))
     .filter(function(s) {
        return window.getComputedStyle(s).getPropertyValue('display') != 'none';
        });
     var $menuButton = this.$menuButton;
     var $lastMenuItem = $focusableElements[$focusableElements.length - 1];
     var KEYCODE_TAB = 9;

     $menuButton.addEventListener('keydown', function (e) {
        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (isTabPressed && e.shiftKey && e.target.getAttribute('aria-expanded') == 'true') {
            $lastMenuItem.focus();
            e.preventDefault();
        }
    });

    $lastMenuItem.addEventListener('keydown', function (e) {
        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (isTabPressed && !e.shiftKey && $menuButton.offsetParent !== null) {
            $menuButton.focus();
            e.preventDefault();
        }
    });
 };

function SearchResults($module) {
    this.$module = $module;
}

SearchResults.prototype.init = function () {
    // Check for module
    if (!this.$module) {
        return
    }
    var $module = this.$module;
    $module.resultCards = new Array();
    $module.countOfCardsPerPage = new Number();
    $module.currentPageNumber = new Number();
    $module.subTopicButton = $module.querySelector('.idsk-search-results__subtopic');

    if ($module.subTopicButton) {
        $module.subTopicButton.disabled = true;
    }

    // Check for button
    var $links = $module.querySelectorAll('.idsk-search-results__link');
    if (!$links) {
        return
    }

    var $resultsPerPageDropdown = $module.querySelector('.idsk-search-results__content .govuk-select');
    if (!$resultsPerPageDropdown) {
        return
    }

    var $backButton = $module.querySelector('.idsk-search-results__button--back');
    if (!$backButton) {
        return
    }

    var $forwardButton = $module.querySelector('.idsk-search-results__button--forward');
    if (!$forwardButton) {
        return
    }

    var $backButtonMobile = $module.querySelector('.idsk-search-results__button--back__mobile');
    if (!$backButton) {
        return
    }

    var $forwardButtonMobile = $module.querySelector('.idsk-search-results__button--forward__mobile');
    if (!$forwardButton) {
        return
    }

    $module.resultCards = $module.querySelectorAll('.idsk-search-results__card');
    if (!$module.resultCards) {
        return
    }

    var $linkPanelButtons = $module.querySelectorAll('.idsk-search-results__link-panel-button');
    if (!$linkPanelButtons) {
        return
    }

    var $filtersButtonMobile = $module.querySelector('.idsk-search-results__filters__button');
    if (!$filtersButtonMobile) {
        return
    }

    var $turnFiltersOffButtonMobile = $module.querySelector('.idsk-search-results__button--turn-filters-off');
    if (!$turnFiltersOffButtonMobile) {
        return
    }

    var $showResultsButtonMobile = $module.querySelector('.idsk-search-results__button-show-results');
    if (!$showResultsButtonMobile) {
        return
    }

    var $backToResultsButtonMobile = $module.querySelector('.idsk-search-results__button--back-to-results');
    if (!$backToResultsButtonMobile) {
        return
    }

    var $radioButtonsInput = $module.querySelectorAll('.idsk-search-results__filter .govuk-radios__input ');
    if (!$radioButtonsInput) {
        return
    }

    var $contentTypeCheckBoxes = $module.querySelectorAll('.idsk-search-results__filter .govuk-checkboxes__input ');
    if (!$contentTypeCheckBoxes) {
        return
    }

    var $dateFrom = $module.querySelector('#datum-od');
    var $dateTo = $module.querySelector('#datum-do');


    var $topicSearchInput = $module.querySelector('#idsk-search-input__topic');
    if ($topicSearchInput) {
        $topicSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'radios'));
    }

    var $subtopicSearchInput = $module.querySelector('#idsk-search-input__subtopic');
    if ($subtopicSearchInput) {
        $subtopicSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'radios'));
    }

    var $contentTypeSearchInput = $module.querySelector('#idsk-search-input__content-type');
    if ($contentTypeSearchInput) {
        $contentTypeSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'checkboxes'));
    }

    if ($dateFrom) {
        $dateFrom.addEventListener('focusout', this.handleFillDate.bind(this, 'from'));
        if ($dateFrom.value != '') {
            this.handleFillDate.call(this, 'from', $dateFrom);
        }
        $dateTo.addEventListener('focusout', this.handleFillDate.bind(this, 'to'));
        if ($dateTo.value != '') {
            this.handleFillDate.call(this, 'to', $dateTo);
        }
    }

    $backButton.addEventListener('click', this.handleClickPreviousPage.bind(this));
    $forwardButton.addEventListener('click', this.handleClickNextPage.bind(this));
    $backButtonMobile.addEventListener('click', this.handleClickPreviousPage.bind(this));
    $forwardButtonMobile.addEventListener('click', this.handleClickNextPage.bind(this));
    $filtersButtonMobile.addEventListener('click', this.handleClickFiltersButton.bind(this));
    $turnFiltersOffButtonMobile.addEventListener('click', this.handleClickTurnFiltersOffButton.bind(this));
    $showResultsButtonMobile.addEventListener('click', this.handleClickShowResultsButton.bind(this));
    $backToResultsButtonMobile.addEventListener('click', this.handleClickShowResultsButton.bind(this));
    $module.boundHandleClickLinkPanel = this.handleClickLinkPanel.bind(this);

    // set selected value in dropdown
    $module.countOfCardsPerPage = $resultsPerPageDropdown.value;
    $module.currentPageNumber = 1;
    this.showResultCardsPerPage.call(this, 0, $resultsPerPageDropdown.value);
    $resultsPerPageDropdown.addEventListener('change', this.handleClickResultsPerPageDropdown.bind(this));
    $filtersButtonMobile.innerText = $filtersButtonMobile.title + '(0)';

    $linkPanelButtons.forEach(function ($button) {
        $button.addEventListener('click', $module.boundHandleClickLinkPanel, true);
    }.bind(this));

    $radioButtonsInput.forEach(function ($input) {
        $input.addEventListener('click', this.handleClickRadioButton.bind(this), true);
        if ($input.checked) {
            this.handleClickRadioButton.call(this, $input);
        }
    }.bind(this));

    $contentTypeCheckBoxes.forEach(function ($checkBox) {
        $checkBox.addEventListener('click', this.handleClickContentTypeCheckBox.bind(this), true);
        if ($checkBox.checked) {
            this.handleClickContentTypeCheckBox.call(this, $checkBox);
        }
    }.bind(this));

    this.handleClickFiltersButton.call(this);
    this.handleClickShowResultsButton.call(this);
};

/**
 * function for handling show results button and 'back to results' button in mobile view
 * hiding and showing elements - mobile version only
 *
 */
SearchResults.prototype.handleClickShowResultsButton = function (e) {
    var $module = this.$module;
    var $filterBar = $module.querySelector('.idsk-search-results__filter');
    var $searchBar = $module.querySelector('.idsk-search-results .idsk-search-results__search-bar');
    var $searchBarTitle = $module.querySelector('.idsk-search-results .idsk-intro-block__search__span');
    var $orderByDropdown = $module.querySelector('.idsk-search-results--order__dropdown');
    var $resultsPerPage = $module.querySelector('.idsk-search-results__filter-panel--mobile');
    var $orderByDropdownMobile = $module.querySelector('.idsk-search-results--order');
    var $pagingMobile = $module.querySelector('.idsk-search-results__page-number--mobile');
    var $pagingDesktop = $module.querySelector('.idsk-search-results__content__page-changer');
    var $searchResultsAll = $module.querySelector('.idsk-search-results__content__all');
    var $filterHeaderPanel = $module.querySelector('.idsk-search-results__filter-header-panel');
    var $pickedFiltersPanel = $module.querySelector('.idsk-search-results__content__picked-filters');
    var $showResultsButton = $module.querySelector('.idsk-search-results__show-results__button');
    var $contentContainer = $module.querySelector('.idsk-search-results__content');
    var $title = $module.querySelector('.idsk-search-results__title');
    var $header = document.getElementsByTagName('header');
    var $footer = document.getElementsByTagName('footer');
    var $breadcrumbs = document.getElementsByClassName('govuk-breadcrumbs');

    $title.classList.remove('idsk-search-results--invisible__mobile');
    $contentContainer.classList.remove('idsk-search-results--invisible__mobile');
    $showResultsButton.classList.add('idsk-search-results--invisible');
    $pickedFiltersPanel.classList.add('idsk-search-results--invisible__mobile');
    $filterBar.classList.remove('idsk-search-results--visible');
    $filterHeaderPanel.classList.remove('idsk-search-results--visible__mobile--inline');
    $searchResultsAll.classList.remove('idsk-search-results--invisible__mobile');
    $pagingMobile.classList.remove('idsk-search-results--invisible');
    $pagingDesktop.classList.remove('idsk-search-results--invisible__mobile');
    $searchBar.classList.remove('idsk-search-results--invisible__mobile');
    if ($searchBarTitle) {
        $searchBarTitle.classList.remove('idsk-search-results--invisible__mobile');
    }
    $orderByDropdown.classList.remove('idsk-search-results--invisible__mobile');
    $resultsPerPage.classList.remove('idsk-search-results--invisible__mobile');
    $orderByDropdownMobile.classList.remove('idsk-search-results--invisible');
    if ($header[0] && $footer[0] && $breadcrumbs[0]) {
        $header[0].classList.remove('idsk-search-results--invisible__mobile');
        $footer[0].classList.remove('idsk-search-results--invisible__mobile');
        $breadcrumbs[0].classList.remove('idsk-search-results--invisible__mobile');
    }
};

/**
 * function for handling whether is some filter picked, because of hiding and showing elements in container with picked items
 * returns boolean
 *
 */
SearchResults.prototype.handleSomeFilterPicked = function (e) {
    var $module = this.$module;
    var $contentContainer = $module.querySelector('.idsk-search-results__content');
    var $pickedTopics = $module.querySelectorAll('.idsk-search-results__picked-topic');
    var $pickedContentTypes = $module.querySelectorAll('.idsk-search-results__picked-content-type');
    var $pickedDates = $module.querySelectorAll('.idsk-search-results__picked-date');
    var $isFilterPicked = $pickedTopics.length > 0 || $pickedContentTypes.length > 0 || $pickedDates.length > 0;

    if ($isFilterPicked) {
        $contentContainer.classList.remove('idsk-search-results--invisible__mobile');
    } else {
        $contentContainer.classList.add('idsk-search-results--invisible__mobile');
    }

    return $isFilterPicked
};

/**
 * function for counting selected filters, for mobile button 'Filters' purposes
 *
 */
SearchResults.prototype.handleCountForFiltersButton = function (e) {
    var $module = this.$module;
    var $pickedTopics = $module.querySelectorAll('.idsk-search-results__picked-topic');
    var $pickedContentTypes = $module.querySelectorAll('.idsk-search-results__picked-content-type');
    var $pickedDates = $module.querySelectorAll('.idsk-search-results__picked-date');
    var $filtersButtonMobile = $module.querySelector('.idsk-search-results__filters__button');
    var $countOfPickedFilters = $pickedTopics.length + $pickedContentTypes.length + $pickedDates.length;

    $filtersButtonMobile.innerText = $filtersButtonMobile.title + '(' + $countOfPickedFilters + ')';
};

/**
 * function for disabling all picked filters
 *
 */
SearchResults.prototype.handleClickTurnFiltersOffButton = function (e) {
    var $module = this.$module;
    var $contentContainer = $module.querySelector('.idsk-search-results__content');
    var $pickedTopics = $module.querySelectorAll('.idsk-search-results__picked-topic');
    var $pickedContentTypes = $module.querySelectorAll('.idsk-search-results__picked-content-type');
    var $pickedDates = $module.querySelectorAll('.idsk-search-results__picked-date');
    var $filtersButtonMobile = $module.querySelector('.idsk-search-results__filters__button');

    $contentContainer.classList.add('idsk-search-results--invisible__mobile');
    $filtersButtonMobile.innerText = $filtersButtonMobile.title + '(0)';

    $pickedTopics.forEach(function ($topic) {
        this.handleRemovePickedTopic.call(this, $topic);
    }.bind(this));

    $pickedContentTypes.forEach(function ($contentType) {
        this.handleRemovePickedContentType.call(this, $contentType);
    }.bind(this));

    $pickedDates.forEach(function ($date) {
        this.handleRemovePickedDate.call(this, $date);
    }.bind(this));
};

/**
 * function for changing view for mobile after click on "Filters" button
 *
 */
SearchResults.prototype.handleClickFiltersButton = function (e) {
    var $module = this.$module;
    var $filterBar = $module.querySelector('.idsk-search-results__filter');
    var $searchBar = $module.querySelector('.idsk-search-results .idsk-search-results__search-bar');
    var $searchBarTitle = $module.querySelector('.idsk-search-results .idsk-intro-block__search__span');
    var $orderByDropdown = $module.querySelector('.idsk-search-results--order__dropdown');
    var $resultsPerPage = $module.querySelector('.idsk-search-results__filter-panel--mobile');
    var $orderByDropdownMobile = $module.querySelector('.idsk-search-results--order');
    var $pagingMobile = $module.querySelector('.idsk-search-results__page-number--mobile');
    var $pagingDesktop = $module.querySelector('.idsk-search-results__content__page-changer');
    var $searchResultsAll = $module.querySelector('.idsk-search-results__content__all');
    var $filterHeaderPanel = $module.querySelector('.idsk-search-results__filter-header-panel');
    var $pickedFiltersPanel = $module.querySelector('.idsk-search-results__content__picked-filters');
    var $showResultsButton = $module.querySelector('.idsk-search-results__show-results__button');
    var $title = $module.querySelector('.idsk-search-results__title');
    var $header = document.getElementsByTagName('header');
    var $footer = document.getElementsByTagName('footer');
    var $breadcrumbs = document.getElementsByClassName('govuk-breadcrumbs');

    if (this.handleSomeFilterPicked.call(this)) {
        $showResultsButton.classList.remove('idsk-search-results--invisible');
        $pickedFiltersPanel.classList.remove('idsk-search-results--invisible__mobile');
    }

    $title.classList.add('idsk-search-results--invisible__mobile');
    $filterBar.classList.add('idsk-search-results--visible');
    $filterHeaderPanel.classList.add('idsk-search-results--visible__mobile--inline');
    $searchResultsAll.classList.add('idsk-search-results--invisible__mobile');
    $pagingMobile.classList.add('idsk-search-results--invisible');
    $pagingDesktop.classList.add('idsk-search-results--invisible__mobile');
    $searchBar.classList.add('idsk-search-results--invisible__mobile');
    if ($searchBarTitle) {
        $searchBarTitle.classList.add('idsk-search-results--invisible__mobile');
    }
    $orderByDropdown.classList.add('idsk-search-results--invisible__mobile');
    $resultsPerPage.classList.add('idsk-search-results--invisible__mobile');

    if ($header[0] && $footer[0] && $breadcrumbs[0]) {
        $header[0].classList.add('idsk-search-results--invisible__mobile');
        $footer[0].classList.add('idsk-search-results--invisible__mobile');
        $breadcrumbs[0].classList.add('idsk-search-results--invisible__mobile');
    }
    $orderByDropdownMobile.classList.add('idsk-search-results--invisible');
};

SearchResults.prototype.handleClickPreviousPage = function (e) {
    var $module = this.$module;

    location.href = "#";
    $module.currentPageNumber = $module.currentPageNumber - 1;
    this.showResultCardsPerPage.call(this, $module.countOfCardsPerPage * ($module.currentPageNumber - 1), $module.countOfCardsPerPage * $module.currentPageNumber);
};

SearchResults.prototype.handleClickNextPage = function (e) {
    var $module = this.$module;

    location.href = "#";
    $module.currentPageNumber = $module.currentPageNumber + 1;
    this.showResultCardsPerPage.call(this, $module.countOfCardsPerPage * ($module.currentPageNumber - 1), $module.countOfCardsPerPage * $module.currentPageNumber);
};

SearchResults.prototype.handleClickResultsPerPageDropdown = function (e) {
    var $el = e.target || e.srcElement;
    var $module = this.$module;

    $module.countOfCardsPerPage = $el.value;
    this.showResultCardsPerPage.call(this, 0, $el.value);
};

SearchResults.prototype.handleSearchItemsFromInput = function ($type, e) {
    var $el = e.target || e.srcElement;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');

    var $items = $linkPanelButton.querySelectorAll('.govuk-' + $type + '__item');
    $items.forEach(function ($item) {
        $item.classList.remove('idsk-search-results--invisible');
    }.bind(this));
    $items.forEach(function ($item) {
        var $labelItem = $item.querySelector('.govuk-' + $type + '__label');

        if (!$labelItem.innerText.toLowerCase().includes($el.value.toLowerCase())) {
            $item.classList.add('idsk-search-results--invisible');
        }
    }.bind(this));
};

SearchResults.prototype.handleFillDate = function ($period, e) {
    var $el = e.target || e.srcElement || e;
    var $module = this.$module;
    var $choosenDatesInFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters__date');
    var $class = 'idsk-search-results__picked-date';
    var $dateElementInContainer = $choosenDatesInFiltersContainer.querySelector('[data-source="' + $el.id + '"]');
    var $contentContainer = $module.querySelector('.idsk-search-results__content');

    if ($el.value == '' || !($el.value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/) || $el.value.match(/^(\d{4})$/))) {
        return;
    }

    if ($el.value && !$dateElementInContainer) {
        var $contentTypePicked = this.createTopicInContainer.call(this, $choosenDatesInFiltersContainer, $el.id, $class, $el, $el.id == 'datum-od' ? true : false);
    } else if ($dateElementInContainer) {
        $contentTypePicked = $dateElementInContainer;
        $contentTypePicked.innerHTML = $el.value + ' &#10005;';
    }

    $contentContainer.classList.remove('idsk-search-results--invisible__mobile');
    $contentTypePicked.addEventListener('click', this.handleRemovePickedDate.bind(this));
    $el.value = '';
    $choosenDatesInFiltersContainer.classList.remove('idsk-search-results--invisible');
    this.checkValuesInDateContainer.call(this);
    this.changeBackgroundForPickedFilters.call(this);
};

SearchResults.prototype.handleRemovePickedDate = function (e) {
    var $el = e.target || e.srcElement || e;

    $el.remove();
    this.handleSomeFilterPicked.call(this);
    this.checkValuesInDateContainer.call(this);
    this.handleCountForFiltersButton.call(this);
    this.changeBackgroundForPickedFilters.call(this);
};

SearchResults.prototype.createSpanElement = function ($class, $text) {
    var $spanElement = document.createElement('span');
    $spanElement.setAttribute('class', $class);
    $spanElement.innerHTML = $text;

    return $spanElement
};

/**
 * function for checking whether is there any date items selected in container
 *
 */
SearchResults.prototype.checkValuesInDateContainer = function (e) {
    var $choosenDatesInFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters__date');
    var $beforeDateClass = 'idsk-search-results__before-date';
    var $afterDateClass = 'idsk-search-results__after-date';
    var $beforeDateSpan = $choosenDatesInFiltersContainer.querySelector('.' + $beforeDateClass);
    var $afterDateSpan = $choosenDatesInFiltersContainer.querySelector('.' + $afterDateClass);


    $beforeDateSpan ? $beforeDateSpan.remove() : false;
    $afterDateSpan ? $afterDateSpan.remove() : false;

    if (!$choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]') && !$choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]')) {
        $choosenDatesInFiltersContainer.classList.add('idsk-search-results--invisible');
        return
    }

    if ($choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]') && $choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]')) {
        var $beforeDateSpan = this.createSpanElement.call(this, $beforeDateClass, $choosenDatesInFiltersContainer.dataset.lines + ' ' + $choosenDatesInFiltersContainer.dataset.middle);
        var $afterDateSpan = this.createSpanElement.call(this, $afterDateClass, 'a ');

        $choosenDatesInFiltersContainer.insertBefore($beforeDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]'));
        $choosenDatesInFiltersContainer.insertBefore($afterDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]'));
    } else if ($choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]')) {
        var $beforeDateSpan = this.createSpanElement.call(this, $beforeDateClass, $choosenDatesInFiltersContainer.dataset.lines + ' ' + $choosenDatesInFiltersContainer.dataset.after);
        $choosenDatesInFiltersContainer.insertBefore($beforeDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-od"]'));

    } else if ($choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]')) {
        var $afterDateSpan = this.createSpanElement.call(this, $afterDateClass, $choosenDatesInFiltersContainer.dataset.lines + ' ' + $choosenDatesInFiltersContainer.dataset.before);
        $choosenDatesInFiltersContainer.insertBefore($afterDateSpan, $choosenDatesInFiltersContainer.querySelector('[data-source="datum-do"]'));
    }
};

/**
 * function for changing number of cards on page
 *
 */
SearchResults.prototype.showResultCardsPerPage = function ($startIndex, $endIndex) {
    var $module = this.$module;
    var $backButton = $module.querySelector('.idsk-search-results__button--back');
    var $forwardButton = $module.querySelector('.idsk-search-results__button--forward');
    var $pageNumber = $module.querySelector('.idsk-search-results__page-number');
    var $backButtonMobile = $module.querySelector('.idsk-search-results__button--back__mobile');
    var $forwardButtonMobile = $module.querySelector('.idsk-search-results__button--forward__mobile');
    var $pageNumberMobile = $module.querySelector('.idsk-search-results__page-number__mobile');
    var $i;

    //hide all cards
    $module.resultCards.forEach(function ($card) {
        if (!$card.classList.contains('idsk-search-results--invisible')) {
            $card.classList.add('idsk-search-results--invisible');
        }
    }.bind(this));

    if ($endIndex >= $module.resultCards.length) {
        $endIndex = $module.resultCards.length;
        $forwardButton.classList.add('idsk-search-results--hidden');
        $backButton.classList.remove('idsk-search-results--hidden');
        $forwardButtonMobile.classList.add('idsk-search-results--hidden');
        $backButtonMobile.classList.remove('idsk-search-results--hidden');
    } else {
        $forwardButton.classList.remove('idsk-search-results--hidden');
        $forwardButtonMobile.classList.remove('idsk-search-results--hidden');
    }

    if ($startIndex < 0) {
        $startIndex = 0;
    } else if ($startIndex > 0) {
        $backButton.classList.remove('idsk-search-results--hidden');
        $backButtonMobile.classList.remove('idsk-search-results--hidden');
    } else if ($startIndex == 0) {
        $module.currentPageNumber = 1;
    }

    for ($i = $startIndex; $i < $endIndex; $i++) {
        $module.resultCards[$i].classList.remove('idsk-search-results--invisible');
    }

    // hide back button if 1st page is showed
    if ($startIndex == 0 && !$backButton.classList.contains('idsk-search-results--hidden')) {
        $backButton.classList.add('idsk-search-results--hidden');
        $backButtonMobile.classList.add('idsk-search-results--hidden');
    }

    var $numberOfPages = (($module.resultCards.length / $module.countOfCardsPerPage) | 0) + 1;
    var $pageNumberSpan = $module.querySelector('.idsk-search-results__page-number span');
    var $pageNumberText = $pageNumberSpan.dataset.lines.replace("$value1", $module.currentPageNumber).replace("$value2", $numberOfPages);
    $pageNumberSpan.innerText = $pageNumberText;
    $pageNumberMobile.innerText = $pageNumberText;
};

/**
 * An event handler for click event on $linkPanel - collapse or expand filter
 * @param {object} e
 */
SearchResults.prototype.handleClickLinkPanel = function (e) {
    var $el = e.target || e.srcElement;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');
    var $contentPanel = $linkPanelButton.querySelector('.idsk-search-results__list');

    toggleClass($contentPanel, 'idsk-search-results--hidden');
    toggleClass($linkPanelButton, 'idsk-search-results--expand');
};

/**
 * An event handler for click event on radio button
 * @param {object} e
 */
SearchResults.prototype.handleClickRadioButton = function (e) {
    var $el = e.target || e.srcElement || e;
    var $module = this.$module;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');
    var $buttonCaption = $linkPanelButton.querySelector('.idsk-search-results__link-panel--span');
    var $choosenFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters__topics');
    var $radios = $el.closest('.govuk-radios');
    var $filterContainer = $choosenFiltersContainer.querySelector('[data-source="' + $radios.dataset.id + '"]');
    var $class = 'idsk-search-results__picked-topic';
    var $contentContainer = $module.querySelector('.idsk-search-results__content');

    // creating or renaming new span element for picked topic
    if ($el.value && !$filterContainer) {
        var $topicPicked = this.createTopicInContainer.call(this, $choosenFiltersContainer, $radios.dataset.id, $class, $el, false);
        if ($module.subTopicButton) {
            $module.subTopicButton.disabled = false;
        }
    } else if ($filterContainer.dataset.source == $radios.dataset.id) {
        $topicPicked = $filterContainer;
        $topicPicked.innerHTML = $el.value + ' &#10005;';
    } else if ($filterContainer.dataset.source != $radios.dataset.id) {
        var $topicPicked = this.createTopicInContainer.call(this, $choosenFiltersContainer, $radios.dataset.id, $class, $el, false);
    }

    $contentContainer.classList.remove('idsk-search-results--invisible__mobile');
    $choosenFiltersContainer.classList.remove('idsk-search-results--invisible');
    $topicPicked.removeEventListener('click', this.handleRemovePickedTopic.bind(this), true);
    $topicPicked.addEventListener('click', this.handleRemovePickedTopic.bind(this));
    this.changeBackgroundForPickedFilters.call(this);
    $buttonCaption.innerText = '1 ' + $buttonCaption.dataset.lines;
};

SearchResults.prototype.handleClickContentTypeCheckBox = function (e) {
    var $el = e.target || e.srcElement || e;
    var $module = this.$module;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');
    var $choosenFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters__content-type');
    var $checkBoxes = $el.closest('.govuk-checkboxes');
    var $class = 'idsk-search-results__picked-content-type';
    var $contentContainer = $module.querySelector('.idsk-search-results__content');

    if ($el.checked) {
        var $contentTypePicked = this.createTopicInContainer.call(this, $choosenFiltersContainer, $el.id, $class, $el, false);
        $contentTypePicked.addEventListener('click', this.handleRemovePickedContentType.bind(this));
    } else {
        var $itemToRemove = $module.querySelector('[data-source="' + $el.id + '"]');
        $itemToRemove.remove();
    }

    $contentContainer.classList.remove('idsk-search-results--invisible__mobile');
    $choosenFiltersContainer.classList.remove('idsk-search-results--invisible');
    this.handleCountOfPickedContentTypes.call(this, $checkBoxes, $linkPanelButton);
    this.changeBackgroundForPickedFilters.call(this);
};

SearchResults.prototype.handleRemovePickedContentType = function (e) {
    var $el = e.target || e.srcElement || e;
    var $checkBoxes = this.$module.querySelector('.idsk-search-results__content-type-filter .govuk-checkboxes');
    var $checkBoxToRemove = $checkBoxes.querySelector('#' + $el.dataset.source);
    var $linkPanelButton = $checkBoxes.closest('.idsk-search-results__link-panel');

    $checkBoxToRemove.checked = false;
    $el.remove();
    this.handleSomeFilterPicked.call(this);
    this.handleCountOfPickedContentTypes.call(this, $checkBoxes, $linkPanelButton);
    this.handleCountForFiltersButton.call(this);
    this.changeBackgroundForPickedFilters.call(this);
};

/**
 * function for counting selected checkboxes in content type filter
 * @param {object} $checkBoxes
 * @param {object} $linkPanelButton
 */
SearchResults.prototype.handleCountOfPickedContentTypes = function ($checkBoxes, $linkPanelButton) {
    var $choosenFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters__content-type');
    var $buttonCaption = $linkPanelButton.querySelector('.idsk-search-results__link-panel--span');
    var $counter = 0;

    if ($checkBoxes) {
        $checkBoxes.querySelectorAll('.govuk-checkboxes__input').forEach(function ($checkBox) {
            if ($checkBox.checked) {
                $counter = $counter + 1;
            }
        }.bind(this));
    }
    if ($counter == 0) {
        $buttonCaption.innerText = '';
        $choosenFiltersContainer.classList.add('idsk-search-results--invisible');
    } else {
        $buttonCaption.innerText = $counter + ' ' + $buttonCaption.dataset.lines;
    }
};

/**
 * function for creating element in container, in case of date we need param $insertBeforeFirst to check whether it should be on first position or not
 * @param {object} $choosenFiltersContainer
 * @param {object} $input
 * @param {object} $el
 * @param {boolean} $insertBeforeFirst
 */
SearchResults.prototype.createTopicInContainer = function ($choosenFiltersContainer, $input, $class, $el, $insertBeforeFirst) {
    var $showResultsMobileButton = this.$module.querySelector('.idsk-search-results__show-results__button');
    var $turnFiltersOffMobileButton = this.$module.querySelector('.idsk-search-results__button--turn-filters-off');
    var $pickedFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters');

    var $topicPicked = document.createElement('button');
    $topicPicked.setAttribute('class', $class);
    $topicPicked.setAttribute('tabindex', "0");
    $topicPicked.setAttribute('data-source', $input);
    $topicPicked.setAttribute('data-id', $el.id);
    $topicPicked.innerHTML = $el.value + ' &#10005;';
    if ($insertBeforeFirst) {
        $choosenFiltersContainer.prepend($topicPicked);
    } else {
        $choosenFiltersContainer.appendChild($topicPicked);
    }

    $pickedFiltersContainer.classList.remove('idsk-search-results--invisible');
    $pickedFiltersContainer.classList.remove('idsk-search-results--invisible__mobile');
    $showResultsMobileButton.classList.remove('idsk-search-results--invisible');
    $turnFiltersOffMobileButton.classList.remove('idsk-search-results--invisible');
    this.handleCountForFiltersButton.call(this);

    return $topicPicked
};

/**
 * function for setting grey background for odd elements in picked topics container
 *
 */
SearchResults.prototype.changeBackgroundForPickedFilters = function (e) {
    var $module = this.$module;
    var $pickedFiltersContainer = $module.querySelector('.idsk-search-results__content__picked-filters');
    var $notEmptySections = $pickedFiltersContainer.querySelectorAll('div:not(.idsk-search-results--invisible)');

    if ($notEmptySections.length == 0) {
        return
    }

    $notEmptySections.forEach(function ($section) {
        $section.classList.remove('idsk-search-results--grey');
        $section.classList.remove('idsk-search-results--border');
    }.bind(this));

    var $i;
    for ($i = 0; $i < $notEmptySections.length; $i++) {
        if ($i == 0 || $i == 2) {
            $notEmptySections[$i].classList.add('idsk-search-results--grey');
        }
    }

    $notEmptySections[$notEmptySections.length - 1].classList.add('idsk-search-results--border');
};

/**
 * function for disabling 'subtopic' filter, in case of removing topic filter
 *
 */
SearchResults.prototype.disableSubtopic = function (e) {
    var $contentPanel = this.$module.subTopicButton.parentElement.querySelector('.idsk-search-results__list');

    this.$module.subTopicButton.parentElement.classList.remove('idsk-search-results--expand');
    $contentPanel.classList.add('idsk-search-results--hidden');
    if (this.$module.subTopicButton) {
        this.$module.subTopicButton.disabled = true;
    }
};

SearchResults.prototype.handleRemovePickedTopic = function (e) {
    var $el = e.target || e.srcElement || e;
    var $choosenFiltersContainer = this.$module.querySelector('.idsk-search-results__content__picked-filters__topics');

    if ($el.dataset.source == 'tema') {
        var $subTopic = $choosenFiltersContainer.querySelector('[data-source="podtema"]');
        if ($subTopic) {
            this.removeTopic.call(this, $subTopic, true);
        } else {
            if (this.$module.subTopicButton) {
                this.disableSubtopic.call(this);
            }
        }
        $choosenFiltersContainer.classList.add('idsk-search-results--invisible');
    }

    this.removeTopic.call(this, $el, false);
};

SearchResults.prototype.removeTopic = function ($el, $disableFilter) {
    var $radios = this.$module.querySelector('[data-id="' + $el.dataset.source + '"]');
    var $buttonCaption = $radios.closest('.idsk-search-results__link-panel');

    $buttonCaption.querySelector('.idsk-search-results__link-panel--span').innerText = '';
    $radios.querySelectorAll('.govuk-radios__input').forEach(function ($radio) {
        $radio.checked = false;
    }.bind(this));

    if ($disableFilter && this.$module.subTopicButton) {
        this.disableSubtopic.call(this);
    }

    $el.remove();
    this.handleSomeFilterPicked.call(this);
    this.handleCountForFiltersButton.call(this);
    this.changeBackgroundForPickedFilters.call(this);
};

function initCore$1(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== "undefined" ? options : {};

  // Allow the user to initialise ID-SK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  var $buttons = scope.querySelectorAll('[data-module="idsk-button"]');
  nodeListForEach($buttons, function ($button) {
    new Button$1($button).init();
  });
 
  // Find first Footer-extended module to enhance.
  var $footerExtended = scope.querySelectorAll(
    '[data-module="idsk-footer-extended"]'
  );
  nodeListForEach($footerExtended, function ($footerExtended) {
    new FooterExtended($footerExtended).init();
  });

  var $characterCounts = scope.querySelectorAll(
    '[data-module="idsk-character-count"]'
  );
  nodeListForEach($characterCounts, function ($characterCount) {
    new CharacterCount$1($characterCount).init();
  });

  var $customerSurveys = scope.querySelectorAll('[data-module="idsk-customer-surveys"]');
  nodeListForEach($customerSurveys, function ($customerSurveys) {
    new CustomerSurveys($customerSurveys).init();
  });

  var $headersWeb = scope.querySelectorAll('[data-module="idsk-header-web"]');
  nodeListForEach($headersWeb, function ($headerWeb) {
    new HeaderWeb($headerWeb).init();
  });

  var $searchResults = scope.querySelector('[data-module="idsk-search-results"]');
  new SearchResults($searchResults).init();

  // Init all GOVUK components js
  initCore(options);
}

function Accordion ($module) {
  this.$module = $module;
  this.moduleId = $module.getAttribute('id');
  this.$sections = $module.querySelectorAll('.govuk-accordion__section');
  this.$openAllButton = '';
  this.browserSupportsSessionStorage = helper.checkForSessionStorage();

  this.controlsClass = 'govuk-accordion__controls';
  this.openAllClass = 'govuk-accordion__open-all';
  this.iconClass = 'govuk-accordion__icon';

  this.sectionHeaderClass = 'govuk-accordion__section-header';
  this.sectionHeaderFocusedClass = 'govuk-accordion__section-header--focused';
  this.sectionHeadingClass = 'govuk-accordion__section-heading';
  this.sectionSummaryClass = 'govuk-accordion__section-summary';
  this.sectionButtonClass = 'govuk-accordion__section-button';
  this.sectionExpandedClass = 'govuk-accordion__section--expanded';
}

// Initialize component
Accordion.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  this.initControls();

  this.initSectionHeaders();

  // See if "Open all" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};

// Initialise controls and set attributes
Accordion.prototype.initControls = function () {
  // Create "Open all" button and set attributes
  this.$openAllButton = document.createElement('button');
  this.$openAllButton.setAttribute('type', 'button');
  this.$openAllButton.innerHTML = 'Open all <span class="govuk-visually-hidden">sections</span>';
  this.$openAllButton.setAttribute('class', this.openAllClass);
  this.$openAllButton.setAttribute('aria-expanded', 'false');
  this.$openAllButton.setAttribute('type', 'button');

  // Create control wrapper and add controls to it
  var accordionControls = document.createElement('div');
  accordionControls.setAttribute('class', this.controlsClass);
  accordionControls.appendChild(this.$openAllButton);
  this.$module.insertBefore(accordionControls, this.$module.firstChild);

  // Handle events for the controls
  this.$openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this));
};

// Initialise section headers
Accordion.prototype.initSectionHeaders = function () {
  // Loop through section headers
  nodeListForEach$1(this.$sections, function ($section, i) {
    // Set header attributes
    var header = $section.querySelector('.' + this.sectionHeaderClass);
    this.initHeaderAttributes(header, i);

    this.setExpanded(this.isExpanded($section), $section);

    // Handle events
    header.addEventListener('click', this.onSectionToggle.bind(this, $section));

    // See if there is any state stored in sessionStorage and set the sections to
    // open or closed.
    this.setInitialState($section);
  }.bind(this));
};

// Set individual header attributes
Accordion.prototype.initHeaderAttributes = function ($headerWrapper, index) {
  var $module = this;
  var $span = $headerWrapper.querySelector('.' + this.sectionButtonClass);
  var $heading = $headerWrapper.querySelector('.' + this.sectionHeadingClass);
  var $summary = $headerWrapper.querySelector('.' + this.sectionSummaryClass);

  // Copy existing span element to an actual button element, for improved accessibility.
  var $button = document.createElement('button');
  $button.setAttribute('type', 'button');
  $button.setAttribute('id', this.moduleId + '-heading-' + (index + 1));
  $button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1));

  // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button
  for (var i = 0; i < $span.attributes.length; i++) {
    var attr = $span.attributes.item(i);
    $button.setAttribute(attr.nodeName, attr.nodeValue);
  }

  $button.addEventListener('focusin', function (e) {
    if (!$headerWrapper.classList.contains($module.sectionHeaderFocusedClass)) {
      $headerWrapper.className += ' ' + $module.sectionHeaderFocusedClass;
    }
  });

  $button.addEventListener('blur', function (e) {
    $headerWrapper.classList.remove($module.sectionHeaderFocusedClass);
  });

  if (typeof ($summary) !== 'undefined' && $summary !== null) {
    $button.setAttribute('aria-describedby', this.moduleId + '-summary-' + (index + 1));
  }

  // $span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
  $button.innerHTML = $span.innerHTML;

  $heading.removeChild($span);
  $heading.appendChild($button);

  // Add "+/-" icon
  var icon = document.createElement('span');
  icon.className = this.iconClass;
  icon.setAttribute('aria-hidden', 'true');

  $heading.appendChild(icon);
};

// When section toggled, set and store state
Accordion.prototype.onSectionToggle = function ($section) {
  var expanded = this.isExpanded($section);
  this.setExpanded(!expanded, $section);

  // Store the state in sessionStorage when a change is triggered
  this.storeState($section);
};

// When Open/Close All toggled, set and store state
Accordion.prototype.onOpenOrCloseAllToggle = function () {
  var $module = this;
  var $sections = this.$sections;

  var nowExpanded = !this.checkIfAllSectionsOpen();

  nodeListForEach$1($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section);
    // Store the state in sessionStorage when a change is triggered
    $module.storeState($section);
  });

  $module.updateOpenAllButton(nowExpanded);
};

// Set section attributes when opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  var $button = $section.querySelector('.' + this.sectionButtonClass);
  $button.setAttribute('aria-expanded', expanded);

  if (expanded) {
    $section.classList.add(this.sectionExpandedClass);
  } else {
    $section.classList.remove(this.sectionExpandedClass);
  }

  // See if "Open all" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};

// Get state of section
Accordion.prototype.isExpanded = function ($section) {
  return $section.classList.contains(this.sectionExpandedClass)
};

// Check if all sections are open
Accordion.prototype.checkIfAllSectionsOpen = function () {
  // Get a count of all the Accordion sections
  var sectionsCount = this.$sections.length;
  // Get a count of all Accordion sections that are expanded
  var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length;
  var areAllSectionsOpen = sectionsCount === expandedSectionCount;

  return areAllSectionsOpen
};

// Update "Open all" button
Accordion.prototype.updateOpenAllButton = function (expanded) {
  var newButtonText = expanded ? 'Close all' : 'Open all';
  newButtonText += '<span class="govuk-visually-hidden"> sections</span>';
  this.$openAllButton.setAttribute('aria-expanded', expanded);
  this.$openAllButton.innerHTML = newButtonText;
};

// Check for `window.sessionStorage`, and that it actually works.
var helper = {
  checkForSessionStorage: function () {
    var testString = 'this is the test string';
    var result;
    try {
      window.sessionStorage.setItem(testString, testString);
      result = window.sessionStorage.getItem(testString) === testString.toString();
      window.sessionStorage.removeItem(testString);
      return result
    } catch (exception) {
      if ((typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.log('Notice: sessionStorage not available.');
      }
    }
  }
};

// Set the state of the accordions in sessionStorage
Accordion.prototype.storeState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    // We need a unique way of identifying each content in the accordion. Since
    // an `#id` should be unique and an `id` is required for `aria-` attributes
    // `id` can be safely used.
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = $button.getAttribute('aria-expanded');

      if (typeof contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria controls present in accordion section heading.'));
      }

      if (typeof contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria expanded present in accordion section heading.'));
      }

      // Only set the state when both `contentId` and `contentState` are taken from the DOM.
      if (contentId && contentState) {
        window.sessionStorage.setItem(contentId, contentState);
      }
    }
  }
};

// Read the state of the accordions from sessionStorage
Accordion.prototype.setInitialState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = contentId ? window.sessionStorage.getItem(contentId) : null;

      if (contentState !== null) {
        this.setExpanded(contentState === 'true', $section);
      }
    }
  }
};

(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-b09a5d2acf3314b46a6c8f8d0c31b85c
    var detect = (
      'Element' in this && "nextElementSibling" in document.documentElement
    );

    if (detect) return


    (function (global) {

      // Polyfill from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-404b69b4750d18dea4174930a49170fd
      Object.defineProperty(Element.prototype, "nextElementSibling", {
        get: function(){
          var el = this.nextSibling;
          while (el && el.nodeType !== 1) { el = el.nextSibling; }
          return (el.nodeType === 1) ? el : null;
        }
      });

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-a162235fbc9c0dd40d4032265f44942e
    var detect = (
      'Element' in this && 'previousElementSibling' in document.documentElement
    );

    if (detect) return

    (function (global) {
      // Polyfill from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-b45a1197b842728cb76b624b6ba7d739
      Object.defineProperty(Element.prototype, 'previousElementSibling', {
        get: function(){
          var el = this.previousSibling;
          while (el && el.nodeType !== 1) { el = el.previousSibling; }
          return (el.nodeType === 1) ? el : null;
        }
      });

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function Tabs ($module) {
  this.$module = $module;
  this.$tabs = $module.querySelectorAll('.govuk-tabs__tab');

  this.keys = { left: 37, right: 39, up: 38, down: 40 };
  this.jsHiddenClass = 'govuk-tabs__panel--hidden';
}

Tabs.prototype.init = function () {
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  } else {
    this.setup();
  }
};

Tabs.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: 40.0625em)');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Tabs.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setup();
  } else {
    this.teardown();
  }
};

Tabs.prototype.setup = function () {
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.setAttribute('role', 'tablist');

  nodeListForEach$1($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation');
  });

  nodeListForEach$1($tabs, function ($tab) {
    // Set HTML attributes
    this.setAttributes($tab);

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this);
    $tab.boundTabKeydown = this.onTabKeydown.bind(this);

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true);
    $tab.addEventListener('keydown', $tab.boundTabKeydown, true);

    // Remove old active panels
    this.hideTab($tab);
  }.bind(this));

  // Show either the active tab according to the URL's hash or the first tab
  var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
  this.showTab($activeTab);

  // Handle hashchange events
  $module.boundOnHashChange = this.onHashChange.bind(this);
  window.addEventListener('hashchange', $module.boundOnHashChange, true);
};

Tabs.prototype.teardown = function () {
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.removeAttribute('role');

  nodeListForEach$1($tabListItems, function ($item) {
    $item.removeAttribute('role', 'presentation');
  });

  nodeListForEach$1($tabs, function ($tab) {
    // Remove events
    $tab.removeEventListener('click', $tab.boundTabClick, true);
    $tab.removeEventListener('keydown', $tab.boundTabKeydown, true);

    // Unset HTML attributes
    this.unsetAttributes($tab);
  }.bind(this));

  // Remove hashchange event handler
  window.removeEventListener('hashchange', $module.boundOnHashChange, true);
};

Tabs.prototype.onHashChange = function (e) {
  var hash = window.location.hash;
  var $tabWithHash = this.getTab(hash);
  if (!$tabWithHash) {
    return
  }

  // Prevent changing the hash
  if (this.changingHash) {
    this.changingHash = false;
    return
  }

  // Show either the active tab according to the URL's hash or the first tab
  var $previousTab = this.getCurrentTab();

  this.hideTab($previousTab);
  this.showTab($tabWithHash);
  $tabWithHash.focus();
};

Tabs.prototype.hideTab = function ($tab) {
  this.unhighlightTab($tab);
  this.hidePanel($tab);
};

Tabs.prototype.showTab = function ($tab) {
  this.highlightTab($tab);
  this.showPanel($tab);
};

Tabs.prototype.getTab = function (hash) {
  return this.$module.querySelector('.govuk-tabs__tab[href="' + hash + '"]')
};

Tabs.prototype.setAttributes = function ($tab) {
  // set tab attributes
  var panelId = this.getHref($tab).slice(1);
  $tab.setAttribute('id', 'tab_' + panelId);
  $tab.setAttribute('role', 'tab');
  $tab.setAttribute('aria-controls', panelId);
  $tab.setAttribute('aria-selected', 'false');
  $tab.setAttribute('tabindex', '-1');

  // set panel attributes
  var $panel = this.getPanel($tab);
  $panel.setAttribute('role', 'tabpanel');
  $panel.setAttribute('aria-labelledby', $tab.id);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id');
  $tab.removeAttribute('role');
  $tab.removeAttribute('aria-controls');
  $tab.removeAttribute('aria-selected');
  $tab.removeAttribute('tabindex');

  // unset panel attributes
  var $panel = this.getPanel($tab);
  $panel.removeAttribute('role');
  $panel.removeAttribute('aria-labelledby');
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs.prototype.onTabClick = function (e) {
  if (!e.target.classList.contains('govuk-tabs__tab')) {
  // Allow events on child DOM elements to bubble up to tab parent
    return false
  }
  e.preventDefault();
  var $newTab = e.target;
  var $currentTab = this.getCurrentTab();
  this.hideTab($currentTab);
  this.showTab($newTab);
  this.createHistoryEntry($newTab);
};

Tabs.prototype.createHistoryEntry = function ($tab) {
  var $panel = this.getPanel($tab);

  // Save and restore the id
  // so the page doesn't jump when a user clicks a tab (which changes the hash)
  var id = $panel.id;
  $panel.id = '';
  this.changingHash = true;
  window.location.hash = this.getHref($tab).slice(1);
  $panel.id = id;
};

Tabs.prototype.onTabKeydown = function (e) {
  switch (e.keyCode) {
    case this.keys.left:
    case this.keys.up:
      this.activatePreviousTab();
      e.preventDefault();
      break
    case this.keys.right:
    case this.keys.down:
      this.activateNextTab();
      e.preventDefault();
      break
  }
};

Tabs.prototype.activateNextTab = function () {
  var currentTab = this.getCurrentTab();
  var nextTabListItem = currentTab.parentNode.nextElementSibling;
  if (nextTabListItem) {
    var nextTab = nextTabListItem.querySelector('.govuk-tabs__tab');
  }
  if (nextTab) {
    this.hideTab(currentTab);
    this.showTab(nextTab);
    nextTab.focus();
    this.createHistoryEntry(nextTab);
  }
};

Tabs.prototype.activatePreviousTab = function () {
  var currentTab = this.getCurrentTab();
  var previousTabListItem = currentTab.parentNode.previousElementSibling;
  if (previousTabListItem) {
    var previousTab = previousTabListItem.querySelector('.govuk-tabs__tab');
  }
  if (previousTab) {
    this.hideTab(currentTab);
    this.showTab(previousTab);
    previousTab.focus();
    this.createHistoryEntry(previousTab);
  }
};

Tabs.prototype.getPanel = function ($tab) {
  var $panel = this.$module.querySelector(this.getHref($tab));
  return $panel
};

Tabs.prototype.showPanel = function ($tab) {
  var $panel = this.getPanel($tab);
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs.prototype.hidePanel = function (tab) {
  var $panel = this.getPanel(tab);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs.prototype.unhighlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'false');
  $tab.parentNode.classList.remove('govuk-tabs__list-item--selected');
  $tab.setAttribute('tabindex', '-1');
};

Tabs.prototype.highlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'true');
  $tab.parentNode.classList.add('govuk-tabs__list-item--selected');
  $tab.setAttribute('tabindex', '0');
};

Tabs.prototype.getCurrentTab = function () {
  return this.$module.querySelector('.govuk-tabs__list-item--selected .govuk-tabs__tab')
};

// this is because IE doesn't always return the actual value but a relative full path
// should be a utility function most prob
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
Tabs.prototype.getHref = function ($tab) {
  var href = $tab.getAttribute('href');
  var hash = href.slice(href.indexOf('#'), href.length);
  return hash
};

function initExtended(options) {
    // Set the options to an empty object by default if no options are passed.
    options = typeof options !== 'undefined' ? options : {};

    // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
    // Defaults to the entire document if nothing is set.
    var scope = typeof options.scope !== 'undefined' ? options.scope : document;

    var $accordions = scope.querySelectorAll('[data-module="govuk-accordion"]');
    nodeListForEach$1($accordions, function ($accordion) {
    new Accordion($accordion).init();
    });

    var $tabs = scope.querySelectorAll('[data-module="govuk-tabs"]');
    nodeListForEach$1($tabs, function ($tabs) {
    new Tabs($tabs).init();
    });

    initCore(options);
}

/**
 * Feedback for extended websites
 */
function Feedback($module) {
    this.$module = $module;
}

Feedback.prototype.init = function () {
    var $module = this.$module;
    // check for module
    if (!$module) {
        return;
    }

    var $textAreaCharacterCount = $module.querySelector('#idsk-feedback__question-bar #feedback');
    var $sendButton = $module.querySelector('#idsk-feedback__send-button');
    var $radioButtons = $module.querySelectorAll('.idsk-feedback__radio-button');

    if ($radioButtons) {
        var $self = this;
        // Handle $radioButtons click events
        nodeListForEach($radioButtons, function ($radioButton) {
            $radioButton.addEventListener('click', $self.handleRadioButtonClick.bind($self));
        });
    }

    if ($sendButton) {
        $sendButton.addEventListener('click', this.handleSendButtonClick.bind(this));
    }

    if ($textAreaCharacterCount) {
        $textAreaCharacterCount.addEventListener('input', this.handleStatusOfCharacterCountButton.bind(this));
    }
};

Feedback.prototype.handleSendButtonClick = function (e) {
    var $thanksForFeedbackBar = this.$module.querySelector('.idsk-feedback__thanks');
    var $feedbackContent = this.$module.querySelector('.idsk-feedback__content');

    $feedbackContent.classList.add('idsk-feedback--hidden');
    $thanksForFeedbackBar.classList.remove('idsk-feedback--hidden');
};

Feedback.prototype.handleRadioButtonClick = function (e) {
    var $improoveQuestionBar = this.$module.querySelector('#idsk-feedback__question-bar');

    if (e.srcElement.classList.contains('idsk-feedback-textarea--show')) {
        $improoveQuestionBar.classList.add('idsk-feedback--open');
        $improoveQuestionBar.classList.remove('idsk-feedback--invisible');
    } else {
        $improoveQuestionBar.classList.remove('idsk-feedback--open');
        $improoveQuestionBar.classList.add('idsk-feedback--invisible');
    }
};

Feedback.prototype.handleStatusOfCharacterCountButton = function (e) {
    var $textAreaCharacterCount = this.$module.querySelector('#feedback');
    var $remainingCharacterCountMessage = this.$module.querySelector('#feedback-info');

    var $submitButton = this.$module.querySelector('#idsk-feedback__send-button');

    setTimeout(function () {
        if ($textAreaCharacterCount.classList.contains('govuk-textarea--error') || $remainingCharacterCountMessage.classList.contains('govuk-error-message')) {
            $submitButton.disabled = true;
        } else {
            $submitButton.disabled = false;
        }
    }, 300);
};

/**
 * Crossroad Component
 */
function Crossroad($module) {
  this.$module = $module;
  this.$items = $module.querySelectorAll(".idsk-crossroad-title");
}

Crossroad.prototype.init = function () {
  var $module = this.$module;
  var $items = this.$items;
  var $uncollapseButton = $module.querySelector('#idsk-crossroad__uncollapse-button');

  if (!$module || !$items) {
    return;
  }

  if ($uncollapseButton) {
    $uncollapseButton.addEventListener('click', this.handleShowItems.bind(this));
  }

  nodeListForEach(
    $items,
    function ($item) {
      $item.addEventListener("click", this.handleItemClick.bind(this));
    }.bind(this)
  );
};

Crossroad.prototype.handleItemClick = function (e) {
  var $item = e.target;
  $item.setAttribute("aria-current", "true");
};

Crossroad.prototype.setAriaLabel = function (arr) {
  arr.forEach(function (item) {
    if (item.classList.contains('idsk-crossroad__arria-hidden')) {
      item.setAttribute("aria-hidden", "true");
      toggleClass(item, 'idsk-crossroad__arria-hidden');
    } else if (item.getAttribute("aria-hidden") == "true") {
      item.setAttribute("aria-hidden", "false");
      toggleClass(item, 'idsk-crossroad__arria-hidden');
    }
  });
};

Crossroad.prototype.handleShowItems = function (e) {
  var $crossroadItems = this.$module.querySelectorAll('.idsk-crossroad__item');
  var $uncollapseButton = this.$module.querySelector('#idsk-crossroad__uncollapse-button');
  var $uncollapseDiv = this.$module.querySelector('.idsk-crossroad__uncollapse-div');
  var $crossroadTitles = this.$module.querySelectorAll('.idsk-crossroad-title');
  var $crossroadSubtitles = this.$module.querySelectorAll('.idsk-crossroad-subtitle');
  var $expandedButton = this.$module.querySelector('.idsk-crossroad__colapse--button');

  $crossroadItems.forEach(function (crossroadItem) {
    toggleClass(crossroadItem, 'idsk-crossroad__item--two-columns-show');
  });

  this.setAriaLabel($crossroadTitles);
  this.setAriaLabel($crossroadSubtitles);

  $uncollapseButton.innerHTML = $uncollapseButton.textContent == $uncollapseButton.dataset.line1 ? $uncollapseButton.dataset.line2 : $uncollapseButton.dataset.line1;

  toggleClass(e.srcElement, 'idsk-crossroad__colapse--button-show');
  toggleClass($uncollapseDiv, 'idsk-crossroad__collapse--shadow');
  toggleClass($uncollapseDiv, 'idsk-crossroad__collapse--arrow');
  if($expandedButton.classList.contains('idsk-crossroad__colapse--button-show')) {
    $expandedButton.setAttribute('aria-expanded', 'true');
    $expandedButton.setAttribute('aria-label', $expandedButton.getAttribute('data-text-for-show'));
  } else {
    $expandedButton.setAttribute('aria-expanded', 'false');
    $expandedButton.setAttribute('aria-label', $expandedButton.getAttribute('data-text-for-hide'));
  }
};

function InPageNavigation($module) {
    this.$module = $module;
}

InPageNavigation.prototype.init = function () {
    // Check for module
    var $module = this.$module;
    if (!$module) {
        return
    }

    // Check for button
    var $links = $module.querySelectorAll('.idsk-in-page-navigation__link');
    if (!$links) {
        return
    }

    // list of all ids and titles
    this.$arrTitlesAndElems = [];
    // Handle $link click events
    $links.forEach(function ($link) {
        var $item = {};
        $item.el = document.getElementById($link.href.split('#')[1]);
        this.$arrTitlesAndElems.push($item);
        $link.addEventListener('click', this.handleClickLink.bind(this));
    }.bind(this));

    var $linkPanelButton = $module.querySelector('.idsk-in-page-navigation__link-panel');
    if (!$linkPanelButton) {
        return
    }
    $module.boundCheckCloseClick = this.checkCloseClick.bind(this);
    $module.boundHandleClickLinkPanel = this.handleClickLinkPanel.bind(this);
    $linkPanelButton.addEventListener('click', $module.boundHandleClickLinkPanel, true);

    // Handle floating navigation
    window.addEventListener('scroll', this.scrollFunction.bind(this));
    // Handle case if the viewport is shor and there are more than one article - scrolling is not needed, but navigation pointer has to be updated
    this.$module.labelChanged = false;
};

/**
 * An event handler for click event on $link - add actual title to link panel
 * @param {object} e
 */
InPageNavigation.prototype.handleClickLink = function (e) {
    var $link = e.target || e.srcElement;
    var $id = $link.closest('.idsk-in-page-navigation__link').href.split('#')[1];
    var $panelHeight = this.$module.getElementsByClassName('idsk-in-page-navigation__link-panel')[0].offsetHeight;

    setTimeout(function () {
        if (document.getElementById($id) != null) {
            this.$module.labelChanged = true;
            this.changeCurrentLink($link);
            window.scrollTo(0, document.getElementById($id).offsetTop - ($panelHeight * 2.5));
        } else {
            this.changeCurrentLink($link);
        }
    }.bind(this), 10);
};

/**
 * An event handler for click event on $linkPanel - collapse or expand in page navigation menu
 * @param {object} e
 */
InPageNavigation.prototype.handleClickLinkPanel = function (e) {
    var $module = this.$module;
    var $linkPanelButton = $module.querySelector('.idsk-in-page-navigation__link-panel');
    var $expandedButton = $module.querySelector('.idsk-in-page-navigation__link-panel-button');

    $module.classList.add('idsk-in-page-navigation--expand');
    $linkPanelButton.removeEventListener('click', $module.boundHandleClickLinkPanel, true);
    $expandedButton.setAttribute('aria-expanded', 'true');
    $expandedButton.setAttribute('aria-label', $expandedButton.getAttribute('data-text-for-show'));
    document.addEventListener('click', $module.boundCheckCloseClick, true);
};

/**
 * close navigation if the user click outside navigation
 * @param {object} e
 */
InPageNavigation.prototype.checkCloseClick = function (e) {
    var $el = e.target || e.srcElement;
    var $navigationList = $el.closest('.idsk-in-page-navigation__list');
    var $module = this.$module;
    var $linkPanelButton = $module.querySelector('.idsk-in-page-navigation__link-panel');
    var $expandedButton = $module.querySelector('.idsk-in-page-navigation__link-panel-button');

    if ($navigationList == null) {
        e.stopPropagation(); // prevent bubbling
        $module.classList.remove('idsk-in-page-navigation--expand');
        $linkPanelButton.addEventListener('click', $module.boundHandleClickLinkPanel, true);
        document.removeEventListener('click', $module.boundCheckCloseClick, true);
        $expandedButton.setAttribute('aria-expanded', 'false');
        $expandedButton.setAttribute('aria-label', $expandedButton.getAttribute('data-text-for-hide'));
    }
};

/**
 * When the user scrolls down from the top of the document, set position to fixed
 */
InPageNavigation.prototype.scrollFunction = function () {
    var $module = this.$module;
    var $arrTitlesAndElems = this.$arrTitlesAndElems;
    var $parentModule = $module.parentElement;
    var $navTopPosition = $parentModule.offsetTop - 55; // padding
    var $links = $module.querySelectorAll('.idsk-in-page-navigation__list-item');

    if (window.pageYOffset <= $navTopPosition) {
        $module.classList.remove('idsk-in-page-navigation--sticky');
    } else {
        $module.classList.add('idsk-in-page-navigation--sticky');
    }

    if (this.$module.labelChanged) {
        this.$module.labelChanged = false;
    } else if ($module.classList.contains('idsk-in-page-navigation--sticky')) {
        var $self = this;
        $arrTitlesAndElems.some(function ($item, $index) {
            if ($item.el.offsetTop >= window.scrollY && $item.el.offsetTop <= (window.scrollY + window.innerHeight)) {
                $self.changeCurrentLink($links[$index]);

                return true
            }
        });
    } else {
        this.changeCurrentLink($links[0]);
    }
};

InPageNavigation.prototype.changeCurrentLink = function (el) {
    var $module = this.$module;
    var $currItem = el.closest('.idsk-in-page-navigation__list-item');
    var $articleTitle = $currItem.querySelector('.idsk-in-page-navigation__link-title');
    var $items = $module.querySelectorAll('.idsk-in-page-navigation__list-item');
    var $linkPanelText = $module.querySelector('.idsk-in-page-navigation__link-panel-button');

    $items.forEach(function ($item) {
        $item.classList.remove('idsk-in-page-navigation__list-item--active');
    });
    $currItem.classList.add('idsk-in-page-navigation__list-item--active');
    $linkPanelText.innerText = $articleTitle.innerText;

    // let active item be always visible
    $currItem.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
};

function SearchComponent($module) {
    this.$module = $module;
}

SearchComponent.prototype.init = function () {
    // Check for module
    var $module = this.$module;
    if (!$module) {
        return
    }

    var $searchInputs = $module.querySelectorAll('.idsk-search-component__input');
    if (!$searchInputs) {
        return
    }

    $searchInputs.forEach(function ($searchInput) {
        $searchInput.addEventListener('change', this.handleSearchInput.bind(this));
    }.bind(this));

};

SearchComponent.prototype.handleSearchInput = function (e) {
    var $el = e.target || e.srcElement || e;
    var $searchComponent = $el.closest('.idsk-search-component');
    var $searchLabel = $searchComponent.querySelector('label');

    if ($el.value == '') {
        $searchLabel.classList.remove('govuk-visually-hidden');
    } else {
        $searchLabel.classList.add('govuk-visually-hidden');
    }
};

function TableFilter ($module) {
  this.$module = $module;
  this.selectedFitlersCount = 0;
  this.$activeFilters = [];

  // get texts
  this.removeAllFiltersText = $module.querySelector('.idsk-table-filter__active-filters').dataset.removeAllFilters;
  this.removeFilterText = $module.querySelector('.idsk-table-filter__active-filters').dataset.removeFilter;
}

TableFilter.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  if (!$module) {
    return
  }

  // button to toggle content
  var $toggleButtons = $module.querySelectorAll('.idsk-filter-menu__toggle');

  // Form with all inputs and selects
  var $form = $module.querySelector('form');

  // all inputs for count of selected filters
  var $filterInputs = $module.querySelectorAll('.govuk-input, .govuk-select');

  nodeListForEach($toggleButtons, function ($button) {
    $button.addEventListener('click', this.handleClickTogglePanel.bind(this));
  }.bind(this));

  if ($form) {
    $form.addEventListener('submit', function (e) {
      e.preventDefault();
      this.handleSubmitFilter(this);
    }.bind(this));
  }

  nodeListForEach($filterInputs, function ($input) {
    // for selects
    $input.addEventListener('change', this.handleFilterValueChange.bind(this));
    // for text inputs
    $input.addEventListener('keyup', function (e) {
      // submit if key is enter else change count of used filters
      if (e.key === 'Enter') {
        // send event like this, because submitting form will be ignored if fields are empty
        this.sendSubmitEvent();
      } else {
        this.handleFilterValueChange(e);
      }
    }.bind(this));
  }.bind(this));

  // recalculate height of all expanded panels on window resize
  window.addEventListener('resize', this.handleWindowResize.bind(this));
};
/**
 * Forcing submit event for form
 */
TableFilter.prototype.sendSubmitEvent = function () {
  this.$module.querySelector('form').dispatchEvent(new Event('submit', {
    'bubbles': true,
    'cancelable': true
  }));
};

/**
 * An event handler for click event on $togglePanel - collapse or expand table-filter
 * @param {object} e
 */
TableFilter.prototype.handleClickTogglePanel = function (e) {
  var $el = e.target || e.srcElement;
  var $expandablePanel = $el.parentNode;
  var $content = $el.nextElementSibling;

  // get texts from button dataset
  var openText = $el.dataset.openText;
  var closeText = $el.dataset.closeText;

  // if panel is category, change size of whole panel with animation
  var isCategory = $expandablePanel.classList.contains('idsk-table-filter__category');
  if (isCategory) {
    var $categoryParent = $expandablePanel.parentNode;

    // made more fluid animations for changed spacing with transition
    var marginBottomTitle = isCategory ? 18 : 20;
    var marginBottomExpandedCategory = 25;
    var newParentHeight = ($content.style.height && $content.style.height !== '0px')
      ? parseInt($categoryParent.style.height) - $content.scrollHeight - marginBottomTitle + marginBottomExpandedCategory
      : parseInt($categoryParent.style.height) + $content.scrollHeight + marginBottomTitle - marginBottomExpandedCategory;

    $categoryParent.style.height = newParentHeight + 'px';
  }

  // show element after toggle with slide down animation
  toggleClass($expandablePanel, 'idsk-table-filter--expanded');
  $content.style.height = ($content.style.height && $content.style.height !== '0px' ? '0' : $content.scrollHeight) + 'px';

  // set text for toggle
  var hidden = $content.style.height === '0px';
  var newToggleText = hidden ? openText : closeText;
  var newToggleButton = hidden ? 'false' : 'true';
  var $ariaToggleForm = document.querySelector('.idsk-table-filter__content');
  $el.innerHTML = newToggleText;
  $el.setAttribute('aria-label', newToggleText + ($el.dataset.categoryName ? ' ' + $el.dataset.categoryName : ''));
  $ariaToggleForm.setAttribute('aria-hidden', newToggleButton);

  // toggle tabbable if content is shown or not
  var $items = $content.querySelectorAll(':scope > .idsk-table-filter__filter-inputs input, :scope > .idsk-table-filter__filter-inputs select, .idsk-filter-menu__toggle');
  var tabIndex = hidden ? -1 : 0;
  nodeListForEach($items, function ($filter) {
    $filter.tabIndex = tabIndex;
  });
};

/**
 * A function to remove filter from active filters
 * @param {object} $filterToRemove
 */
TableFilter.prototype.removeActiveFilter = function ($filterToRemove) {
  var $filterToRemoveValue = this.$module.querySelector('.govuk-input[name="' + $filterToRemove.name + '"], .govuk-select[name="' + $filterToRemove.name + '"]');
  if ($filterToRemoveValue.tagName === 'SELECT') {
    // if filter is select find option with empty value
    $filterToRemoveValue.querySelectorAll('option').forEach(function (option, index) {
      if (option.value === '') {
        $filterToRemoveValue.selectedIndex = index;
      }
    });
  } else $filterToRemoveValue.value = '';

  // simulate change event of inputs to change count of active filters and call form submit to send information about filter was changed
  $filterToRemoveValue.dispatchEvent(new Event('change'));

  // send submit event of form to call data changes
  this.sendSubmitEvent();

  this.$activeFilters = this.$activeFilters.filter(function ($filter) {
    return $filter.id !== $filterToRemove.id
  });

  this.renderActiveFilters(this);
};

/**
 * A function to remove all active filters
 * @param {object} e
 */
TableFilter.prototype.removeAllActiveFilters = function (e) {
  this.$activeFilters.forEach(function ($filter) {
    this.removeActiveFilter($filter);
  }.bind(this));
};

/**
 * A function to add elements to DOM object
 * @param {object} e
 */
TableFilter.prototype.renderActiveFilters = function (e) {
  // remove all existing filters from array
  var $activeFiltersPanel = this.$module.querySelector('.idsk-table-filter__active-filters');
  var $activeFilters = $activeFiltersPanel.querySelector('.idsk-table-filter__active-filters .idsk-table-filter__content');
  $activeFilters.innerHTML = '';

  // open filter if active filters was hidden before
  if ($activeFiltersPanel.classList.contains('idsk-table-filter__active-filters__hide')) {
    $activeFiltersPanel.classList.add('idsk-table-filter--expanded');
  }

  // render all filters in active filters
  this.$activeFilters.forEach(function ($filter) {
    var $activeFilter = document.createElement('div');
    $activeFilter.classList.add('idsk-table-filter__parameter', 'govuk-body');
    var $removeFilterBtn = '<button class="idsk-table-filter__parameter-remove" tabindex="0">✕ <span class="govuk-visually-hidden">' + this.removeFilterText + ' ' + $filter.value + '</span></button>';
    $activeFilter.innerHTML = '<span class="idsk-table-filter__parameter-title">' + $filter.value + '</span>' + $removeFilterBtn;

    $activeFilter.querySelector('.idsk-table-filter__parameter-remove').addEventListener('click', function () {
      this.removeActiveFilter($filter);
    }.bind(this));

    $activeFilters.appendChild($activeFilter);
  }.bind(this));

  // add remove everything button if some filter is activated else print none filter is activated
  if (this.$activeFilters.length > 0) {
    $activeFiltersPanel.classList.remove('idsk-table-filter__active-filters__hide');
    var $removeAllFilters = document.createElement('button');
    $removeAllFilters.classList.add('govuk-body', 'govuk-link');
    $removeAllFilters.innerHTML = '<span class="idsk-table-filter__parameter-title">' + this.removeAllFiltersText + ' (' + this.$activeFilters.length + ')</span><span class="idsk-table-filter__parameter-remove">✕</span>';
    $removeAllFilters.addEventListener('click', this.removeAllActiveFilters.bind(this));
    $activeFilters.appendChild($removeAllFilters);
  } else {
    $activeFiltersPanel.classList.add('idsk-table-filter__active-filters__hide');
  }

  // calc height of 'active filter' panel if panel is expanded
  var $activeFiltersContainer = this.$module.querySelector('.idsk-table-filter__active-filters.idsk-table-filter--expanded .idsk-table-filter__content');
  if ($activeFiltersContainer) {
    $activeFiltersContainer.style.height = 'initial'; // to changing height from initial height
    $activeFiltersContainer.style.height = $activeFiltersContainer.scrollHeight + 'px';
  }
};

/**
 * A function to refresh number of selected filters count
 * @param {object} e
 */
TableFilter.prototype.renderSelectedFiltersCount = function (e) {
  var submitButton = this.$module.querySelector('.submit-table-filter');
  submitButton.disabled = this.selectedFitlersCount === 0;

  var counter = submitButton.querySelector('.count');
  counter.innerHTML = this.selectedFitlersCount;
};

/**
 * A submit filters event on click at $submitButton or pressing enter in inputs
 * @param {object} e
 */
TableFilter.prototype.handleSubmitFilter = function (e) {
  // get all inputs and selects
  var $inputs = this.$module.querySelectorAll('.idsk-table-filter__inputs input');
  var $selects = this.$module.querySelectorAll('.idsk-table-filter__inputs select');

  // add values of inputs to $activeFilters if it is not empty
  this.$activeFilters = [];
  $inputs.forEach(function ($input) {
    if ($input.value.length > 0)
      this.$activeFilters.push({
        id: $input.getAttribute('id'),
        name: $input.getAttribute('name'),
        value: $input.value
      });
  }.bind(this));

  $selects.forEach(function ($select) {
    if ($select.value)
      this.$activeFilters.push({
        id: $select.value,
        name: $select.getAttribute('name'),
        value: $select.options[$select.selectedIndex].text
      });
  }.bind(this));

  // render all filters in active filters
  this.renderActiveFilters(this);
};

/**
 * An event handler for on change event for all inputs and selects
 * @param {object} e
 */
TableFilter.prototype.handleFilterValueChange = function (e) {
  var $el = e.target || e.srcElement;

  // if filter is in category get count of selected filters only from that category
  var $category = $el.closest('.idsk-table-filter__category');
  if ($category) {
    var $allCategoryFilters = $category.querySelectorAll('.idsk-table-filter__inputs input, .idsk-table-filter__inputs select');
    var selectedCategoryFiltersCount = 0;
    $allCategoryFilters.forEach(function ($filter) {
      if ($filter.value) {
        selectedCategoryFiltersCount++;
      }
    });
    $category.querySelector('.count').innerHTML = selectedCategoryFiltersCount ? '(' + selectedCategoryFiltersCount + ')' : '';
  }

  // get count of all selected filters
  this.selectedFitlersCount = 0;
  var $allFilters = this.$module.querySelectorAll('.idsk-table-filter__inputs input, .idsk-table-filter__inputs select');
  $allFilters.forEach(function ($filter) {
    if ($filter.value) {
      this.selectedFitlersCount++;
    }
  }.bind(this));

  // render count of selected filters
  this.renderSelectedFiltersCount(this);
};

/**
 * An event handler for window resize to change elements based on scrollHeight
 * @param {object} e
 */
TableFilter.prototype.handleWindowResize = function (e) {
  var $allExpandedPanels = this.$module.querySelectorAll('.idsk-table-filter--expanded');
  nodeListForEach($allExpandedPanels, function ($panel) {
    var $content = $panel.querySelector('.idsk-table-filter__content');
    $content.style.height = 'initial'; // to changing height from initial height
    $content.style.height = $content.scrollHeight + 'px';
  });
};

function Stepper($module) {
  this.$module = $module;
  this.$moduleId = $module.getAttribute('id');
  this.$sections = $module.querySelectorAll('.idsk-stepper__section');
  this.$links = $module.querySelectorAll('.idsk-stepper__section-content .govuk-link');
  this.$openAllButton = '';
  this.$browserSupportsSessionStorage = $helper.checkForSessionStorage();

  this.$controlsClass = 'idsk-stepper__controls';
  this.$openAllClass = 'idsk-stepper__open-all';
  this.$iconClass = 'idsk-stepper__icon';

  this.$sectionHeaderClass = 'idsk-stepper__section-header';
  this.$sectionHeaderFocusedClass = 'idsk-stepper__section-header--focused';
  this.$sectionHeadingClass = 'idsk-stepper__section-heading';
  this.$sectionSummaryClass = 'idsk-stepper__section-summary';
  this.$sectionButtonClass = 'idsk-stepper__section-button';
  this.$sectionExpandedClass = 'idsk-stepper__section--expanded';
}

// Initialize component
Stepper.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  this.initControls();
  this.initSectionHeaders();

  nodeListForEach(
    this.$links,
    function ($link) {
      $link.addEventListener('click', this.handleItemLink.bind(this));
      $link.addEventListener('blur', this.handleItemLinkBlur.bind(this));
    }.bind(this)
  );

  // See if "Zobraziť všetko" button text should be updated
  var $areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton($areAllSectionsOpen);
};

// Initialise controls and set attributes
Stepper.prototype.initControls = function () {
  var $accordionControls = this.$module.querySelector('.idsk-stepper__controls');

  if ($accordionControls) {
    // Create "Zobraziť všetko" button and set attributes
    this.$openAllButton = document.createElement('button');
    this.$openAllButton.setAttribute('type', 'button');
    this.$openAllButton.setAttribute('class', this.$openAllClass);
    this.$openAllButton.setAttribute('aria-expanded', 'false');
    this.$openAllButton.setAttribute('type', 'button');

    // Create control wrapper and add controls to it
    $accordionControls.appendChild(this.$openAllButton);

    // Handle events for the controls
    this.$openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this));
  } else {
    console.log("Incorrect implementation of stepper, stepper controls are missing.");
  }
};

// Initialise section headers
Stepper.prototype.initSectionHeaders = function () {
  // Loop through section headers
  nodeListForEach(this.$sections, function ($section, $i) {
    // Set header attributes
    var $header = $section.querySelector('.' + this.$sectionHeaderClass);

    if ($header) {
      this.initHeaderAttributes($header, $i);

      this.setExpanded(this.isExpanded($section), $section);

      // Handle events
      $header.addEventListener('click', this.onSectionToggle.bind(this, $section));

      // See if there is any state stored in sessionStorage and set the sections to
      // open or closed.
      this.setInitialState($section);
    } else {
      console.log("Incorrect implementation of stepper, stepper header is missing.");
    }
  }.bind(this));
};

Stepper.prototype.handleItemLink = function (e) {
  var $link = e.target || e.srcElement;
  var $currentSection = $link.closest('.idsk-stepper__section');
  $currentSection.classList.add('idsk-stepper__bolder-line');
};

Stepper.prototype.handleItemLinkBlur = function (e) {
  var $link = e.target || e.srcElement;
  var $currentSection = $link.closest('.idsk-stepper__section');
  $currentSection.classList.remove('idsk-stepper__bolder-line');
};

// Set individual header attributes
Stepper.prototype.initHeaderAttributes = function ($headerWrapper, index) {
  var $module = this.$module;
  var $span = $headerWrapper.querySelector('.' + this.$sectionButtonClass);
  var $heading = $headerWrapper.querySelector('.' + this.$sectionHeadingClass);
  var $summary = $headerWrapper.querySelector('.' + this.$sectionSummaryClass);

  if (!$span) {
    return;
  }

  // Copy existing span element to an actual button element, for improved accessibility.
  var $button = document.createElement('button');
  $button.setAttribute('type', 'button');
  $button.setAttribute('id', this.$moduleId + '-heading-' + (index + 1));
  $button.setAttribute('aria-controls', this.$moduleId + '-content-' + (index + 1));

  // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button
  for (var i = 0; i < $span.attributes.length; i++) {
    var $attr = $span.attributes.item(i);
    $button.setAttribute($attr.nodeName, $attr.nodeValue);
  }

  $button.addEventListener('focusin', function (e) {
    if (!$headerWrapper.classList.contains($module.$sectionHeaderFocusedClass)) {
      $headerWrapper.className += ' ' + $module.$sectionHeaderFocusedClass;
    }
  });

  $button.addEventListener('blur', function (e) {
    $headerWrapper.classList.remove($module.$sectionHeaderFocusedClass);
  });

  if (typeof ($summary) !== 'undefined' && $summary !== null) {
    $button.setAttribute('aria-describedby', this.$moduleId + '-summary-' + (index + 1));
  }

  // $span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
  $button.innerHTML = $span.innerHTML;

  $heading.removeChild($span);
  $heading.appendChild($button);

  // Add "+/-" icon
  var $icon = document.createElement('span');
  $icon.className = this.$iconClass;
  $icon.setAttribute('aria-hidden', 'true');

  $heading.appendChild($icon);
};

// When section toggled, set and store state
Stepper.prototype.onSectionToggle = function ($section) {
  var $expanded = this.isExpanded($section);
  this.setExpanded(!$expanded, $section);

  // Store the state in sessionStorage when a change is triggered
  this.storeState($section);
};

// When Open/Zatvoriť všetko toggled, set and store state
Stepper.prototype.onOpenOrCloseAllToggle = function () {
  var $self = this;
  var $sections = this.$sections;
  var $nowExpanded = !this.checkIfAllSectionsOpen();

  nodeListForEach($sections, function ($section) {
    $self.setExpanded($nowExpanded, $section);
    // Store the state in sessionStorage when a change is triggered
    $self.storeState($section);
  });

  $self.updateOpenAllButton($nowExpanded);
};

// Set section attributes when opened/closed
Stepper.prototype.setExpanded = function ($expanded, $section) {
  var $button = $section.querySelector('.' + this.$sectionButtonClass);
  if (!$button) {
    return;
  }
  $button.setAttribute('aria-expanded', $expanded);

  if ($expanded) {
    $section.classList.add(this.$sectionExpandedClass);
  } else {
    $section.classList.remove(this.$sectionExpandedClass);
  }

  // See if "Zobraziť všetko" button text should be updated
  var $areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton($areAllSectionsOpen);
};

// Get state of section
Stepper.prototype.isExpanded = function ($section) {
  return $section.classList.contains(this.$sectionExpandedClass)
};

// Check if all sections are open
Stepper.prototype.checkIfAllSectionsOpen = function () {
  // Get a count of all the Accordion sections
  var $sectionsCount = this.$sections.length;
  // Get a count of all Accordion sections that are expanded
  var $expandedSectionCount = this.$module.querySelectorAll('.' + this.$sectionExpandedClass).length;
  var $areAllSectionsOpen = $sectionsCount === $expandedSectionCount;

  return $areAllSectionsOpen
};

// Update "Zobraziť všetko" button
Stepper.prototype.updateOpenAllButton = function ($expanded) {
  var $accordionControls = this.$module.querySelector('.idsk-stepper__controls');
  
  if ($accordionControls) {
    var $newButtonText = $expanded ? $accordionControls.dataset.line2 : $accordionControls.dataset.line1;
    this.$openAllButton.setAttribute('aria-expanded', $expanded);
    this.$openAllButton.innerHTML = $newButtonText;
  } else {
    console.log("Incorrect implementation of stepper, stepper controls are missing.");
  }
};

// Check for `window.sessionStorage`, and that it actually works.
var $helper = {
  checkForSessionStorage: function () {
    var $testString = 'this is the test string';
    var $result;
    try {
      window.sessionStorage.setItem($testString, $testString);
      $result = window.sessionStorage.getItem($testString) === $testString.toString();
      window.sessionStorage.removeItem($testString);
      return $result
    } catch (exception) {
      if ((typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.log('Notice: sessionStorage not available.');
      }
    }
  }
};

// Set the state of the accordions in sessionStorage
Stepper.prototype.storeState = function ($section) {
  if (this.$browserSupportsSessionStorage) {
    // We need a unique way of identifying each content in the accordion. Since
    // an `#id` should be unique and an `id` is required for `aria-` attributes
    // `id` can be safely used.
    var $button = $section.querySelector('.' + this.$sectionButtonClass);

    if ($button) {
      var $contentId = $button.getAttribute('aria-controls');
      var $contentState = $button.getAttribute('aria-expanded');

      if (typeof $contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria controls present in accordion section heading.'));
      }

      if (typeof $contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria expanded present in accordion section heading.'));
      }

      // Only set the state when both `contentId` and `contentState` are taken from the DOM.
      if ($contentId && $contentState) {
        window.sessionStorage.setItem($contentId, $contentState);
      }
    }
  }
};

// Read the state of the accordions from sessionStorage
Stepper.prototype.setInitialState = function ($section) {
  if (this.$browserSupportsSessionStorage) {
    var $button = $section.querySelector('.' + this.$sectionButtonClass);

    if ($button) {
      var $contentId = $button.getAttribute('aria-controls');
      var $contentState = $contentId ? window.sessionStorage.getItem($contentId) : null;

      if ($contentState !== null) {
        this.setExpanded($contentState === 'true', $section);
      }
    }
  }
};

function SubscriptionForm($module) {
  this.$module = $module;
}

SubscriptionForm.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  if (!$module) {
    return
  }

  // button to toggle content
  var $form = $module.querySelector('.idsk-subscription-form__submit-handler');
  if ($form) {
    $form.addEventListener('submit', this.handleSubmitForm.bind(this));
  }

  var $input = $module.querySelector('.govuk-input');

  $input.addEventListener('change', this.handleInput.bind(this));
};

/**
 * An event handler for submit event on $form
 * @param {object} e
 */
SubscriptionForm.prototype.handleSubmitForm = function (e) {
  e.preventDefault();
  var $input = e.target.querySelector('#subscription-email-value');
  var $formGroup = $input.parentElement;

  // Handle email validation
  if (!$input.checkValidity()) {
    $formGroup.querySelectorAll('.govuk-error-message').forEach(function (e) {
      e.remove();
    });
    var $errorLabel = document.createElement('span');
    $errorLabel.classList.add('govuk-error-message');
    $errorLabel.textContent = $input.validationMessage;

    $input.classList.add('govuk-input--error');
    $formGroup.classList.add('govuk-form-group--error');
    $input.before($errorLabel);
    return
  }

  // set class for different state
  this.$module.classList.add('idsk-subscription-form__subscription-confirmed');
};

SubscriptionForm.prototype.handleInput = function (e) {
  var $el = e.target || e.srcElement || e;
  var $searchComponent = $el.closest('.idsk-subscription-form__input');
  var $searchLabel = $searchComponent.querySelector('label');

  // Handle label visibility
  if ($el.value === '') {
    $searchLabel.classList.remove('govuk-visually-hidden');
  } else {
    $searchLabel.classList.add('govuk-visually-hidden');
  }
};

function RegistrationForEvent($module) {
    this.$module = $module;
}

RegistrationForEvent.prototype.init = function () {
    // Check for module
    var $module = this.$module;
    if (!$module) {
        return
    }

    // Check for button
    var $submitButtons = $module.querySelectorAll('.idsk-registration-for-event-js-submit');
    if (!$submitButtons) {
        return
    }

    // Handle $submitButtons click events
    $submitButtons.forEach(function ($submitButton) {
        $submitButton.addEventListener('click', this.handleSubmitClick.bind(this));
    }.bind(this));
};

RegistrationForEvent.prototype.handleSubmitClick = function (e) {
    var $module = this.$module;
    var $form = $module.querySelector('.idsk-registration-for-event__form');
    var $thankYouMsg = $module.querySelector('.idsk-registration-for-event__thank-you-msg');
    var $requiredFormItems = $module.querySelectorAll('[required]');
    var $valid = true;
    var emailRegex = /\S+@\S+\.\S+/;

    $requiredFormItems.forEach(function ($item) {
        var $formGroup = $item.closest('.govuk-form-group');

        if (!$item.checkValidity() || $item.type === 'email' && !emailRegex.test($item.value)) {
            e.preventDefault();

            $formGroup.querySelector('.govuk-error-message').style.display = 'block';
            $formGroup.classList.add('govuk-form-group--error');
            $item.classList.add('govuk-input--error');
            $valid = false;
        } else {
            $formGroup.querySelector('.govuk-error-message').style.display = 'none';
            $formGroup.classList.remove('govuk-form-group--error');
            $item.classList.remove('govuk-input--error');
        }
    });

    if ($valid) {
        $thankYouMsg.style.display = 'block';
        $form.style.display = 'none';
    }
};

function InteractiveMap($module) {
    this.$module = $module;
    this.$currentData = null;
    this.$currentMode = '';
}

InteractiveMap.prototype.init = function () {
    // Check for module
    var $module = this.$module;
    if (!$module) {
        return
    }

    var $radioMap = $module.querySelector('.idsk-intereactive-map__radio-map');
    if ($radioMap) {
        $radioMap.addEventListener('click', this.handleRadioButtonModeClick.bind(this, 'map'));
    }

    var $radioTable = $module.querySelector('.idsk-intereactive-map__radio-table');
    if ($radioTable) {
        $radioTable.addEventListener('click', this.handleRadioButtonModeClick.bind(this, 'table'));
    }

    var $selectTimePeriod = $module.querySelector('.idsk-interactive-map__select-time-period');
    if ($selectTimePeriod) {
        $selectTimePeriod.addEventListener('change', this.renderData.bind(this));
    }

    var $selectIndicator = $module.querySelector('.idsk-interactive-map__select-indicator');
    if ($selectIndicator) {
        $selectIndicator.addEventListener('change', this.renderData.bind(this));
    }

    var $radioBtn = $module.querySelector('.govuk-radios__input');
    var $radiosName = $radioBtn.getAttribute('name');
    var $selectedControlOption = $module.querySelector('input[name="' + $radiosName + '"]:checked').value;
    this.handleRadioButtonModeClick($selectedControlOption);
    this.renderData();
};

InteractiveMap.prototype.handleRadioButtonModeClick = function (type) {

    var $type = type;
    var $module = this.$module;

    if (this.$currentMode === $type) {
        return;
    }

    this.$currentMode = $type;

    if ($type === 'table') {
        $module.querySelector('.idsk-interactive-map__table').style.display = 'block';
        $module.querySelector('.idsk-interactive-map__map').style.display = 'none';
    } else if ($type === 'map') {
        $module.querySelector('.idsk-interactive-map__map').style.display = 'block';
        $module.querySelector('.idsk-interactive-map__table').style.display = 'none';
        $module.querySelector('.idsk-interactive-map__map-iframe').src += ""; // reload content - reset map boundaries
    }
};

InteractiveMap.prototype.renderData = function () {
    var $module = this.$module;
    var $tableEl = $module.querySelector('.idsk-interactive-map__table-iframe');
    var $tableSrc = $tableEl.dataset.src;
    var $mapEl = $module.querySelector('.idsk-interactive-map__map-iframe');
    var $mapSrc = $mapEl.dataset.src;
    var $timePeriodSelect = $module.querySelector('.idsk-interactive-map__select-time-period');
    var $timePeriodValue = $timePeriodSelect.options[$timePeriodSelect.selectedIndex].value;
    var $timePeriod = $timePeriodSelect.options[$timePeriodSelect.selectedIndex].text;
    var $indicatorSelect = $module.querySelector('.idsk-interactive-map__select-indicator');

    if ($indicatorSelect) {
        var $indicatorValue = $indicatorSelect.options[$indicatorSelect.selectedIndex].value;
        var $indicatorText = $indicatorSelect.options[$indicatorSelect.selectedIndex].text;

        $module.querySelector('.idsk-interactive-map__current-indicator').innerText = $indicatorText;
        $module.querySelector('.idsk-interactive-map__current-time-period').innerText = $timePeriod;
    }

    $mapEl.src = $mapSrc + '?indicator=' + $indicatorValue + '&time=' + $timePeriodValue;
    $tableEl.src = $tableSrc + '?indicator=' + $indicatorValue + '&time=' + $timePeriodValue;
};

/*
  Accordion

  This allows a collection of sections to be collapsed by default,
  showing only their headers. Sections can be exanded or collapsed
  individually by clicking their headers. An "Open all" button is
  also added to the top of the accordion, which switches to "Close all"
  when all the sections are expanded.

  The state of each section is saved to the DOM via the `aria-expanded`
  attribute, which also provides accessibility.

*/

function Accordion$1 ($module) {
  this.$module = $module;
  this.moduleId = $module.getAttribute('id');
  this.$sections = $module.querySelectorAll('.govuk-accordion__section');
  this.browserSupportsSessionStorage = helper$1.checkForSessionStorage();

  this.controlsClass = 'govuk-accordion__controls';
  this.openAllClass = 'govuk-accordion__open-all';
  this.iconClass = 'govuk-accordion__icon';

  this.sectionHeaderClass = 'govuk-accordion__section-header';
  this.sectionHeaderFocusedClass = 'govuk-accordion__section-header--focused';
  this.sectionHeadingClass = 'govuk-accordion__section-heading';
  this.sectionSummaryClass = 'govuk-accordion__section-summary';
  this.sectionButtonClass = 'govuk-accordion__section-button';
  this.sectionExpandedClass = 'govuk-accordion__section--expanded';

  this.$openAllButton = $module.querySelector(".govuk-accordion__open-all");
  this.$sectionSpan = $module.querySelector(".govuk-accordion__controls-span");
  this.openTitle = this.$openAllButton.dataset.openTitle;
  this.closeTitle = this.$openAllButton.dataset.closeTitle;
  this.sectionTitle = this.$sectionSpan.dataset.sectionTitle;
}

// Initialize component
Accordion$1.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  this.initControls();

  this.initSectionHeaders();

  // See if "Open all" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};

// Initialise controls and set attributes
Accordion$1.prototype.initControls = function () {
  // Handle events for the controls
  this.$openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this));
};

// Initialise section headers
Accordion$1.prototype.initSectionHeaders = function () {
  // Loop through section headers
  nodeListForEach(this.$sections, function ($section, i) {
    // Set header attributes
    var header = $section.querySelector('.' + this.sectionHeaderClass);
    this.initHeaderAttributes(header, i);

    this.setExpanded(this.isExpanded($section), $section);

    // Handle events
    header.addEventListener('click', this.onSectionToggle.bind(this, $section));

    // See if there is any state stored in sessionStorage and set the sections to
    // open or closed.
    this.setInitialState($section);
  }.bind(this));
};

// Set individual header attributes
Accordion$1.prototype.initHeaderAttributes = function ($headerWrapper, index) {
  var $module = this;
  var $span = $headerWrapper.querySelector('.' + this.sectionButtonClass);
  var $heading = $headerWrapper.querySelector('.' + this.sectionHeadingClass);
  var $summary = $headerWrapper.querySelector('.' + this.sectionSummaryClass);

  // Copy existing span element to an actual button element, for improved accessibility.
  var $button = document.createElement('button');
  $button.setAttribute('type', 'button');
  $button.setAttribute('id', this.moduleId + '-heading-' + (index + 1));
  $button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1));

  // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button
  for (var i = 0; i < $span.attributes.length; i++) {
    var attr = $span.attributes.item(i);
    $button.setAttribute(attr.nodeName, attr.nodeValue);
  }

  $button.addEventListener('focusin', function (e) {
    if (!$headerWrapper.classList.contains($module.sectionHeaderFocusedClass)) {
      $headerWrapper.className += ' ' + $module.sectionHeaderFocusedClass;
    }
  });

  $button.addEventListener('blur', function (e) {
    $headerWrapper.classList.remove($module.sectionHeaderFocusedClass);
  });

  if (typeof ($summary) !== 'undefined' && $summary !== null) {
    $button.setAttribute('aria-describedby', this.moduleId + '-summary-' + (index + 1));
  }

  // $span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
  $button.innerHTML = $span.innerHTML;

  $heading.removeChild($span);
  $heading.appendChild($button);

  // Add "+/-" icon
  var icon = document.createElement('span');
  icon.className = this.iconClass;
  icon.setAttribute('aria-hidden', 'true');

  $heading.appendChild(icon);
};

// When section toggled, set and store state
Accordion$1.prototype.onSectionToggle = function ($section) {
  var expanded = this.isExpanded($section);
  this.setExpanded(!expanded, $section);

  // Store the state in sessionStorage when a change is triggered
  this.storeState($section);
};

// When Open/Close All toggled, set and store state
Accordion$1.prototype.onOpenOrCloseAllToggle = function () {
  var $module = this;
  var $sections = this.$sections;

  var nowExpanded = !this.checkIfAllSectionsOpen();

  nodeListForEach($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section);
    // Store the state in sessionStorage when a change is triggered
    $module.storeState($section);
  });

  $module.updateOpenAllButton(nowExpanded);
};

// Set section attributes when opened/closed
Accordion$1.prototype.setExpanded = function (expanded, $section) {
  var $button = $section.querySelector('.' + this.sectionButtonClass);
  $button.setAttribute('aria-expanded', expanded);

  if (expanded) {
    $section.classList.add(this.sectionExpandedClass);
  } else {
    $section.classList.remove(this.sectionExpandedClass);
  }

  // See if "Open all" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};

// Get state of section
Accordion$1.prototype.isExpanded = function ($section) {
  return $section.classList.contains(this.sectionExpandedClass)
};

// Check if all sections are open
Accordion$1.prototype.checkIfAllSectionsOpen = function () {
  // Get a count of all the Accordion sections
  var sectionsCount = this.$sections.length;
  // Get a count of all Accordion sections that are expanded
  var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length;
  var areAllSectionsOpen = sectionsCount === expandedSectionCount;

  return areAllSectionsOpen
};

// Update "Open all" button
Accordion$1.prototype.updateOpenAllButton = function (expanded) {
  var newButtonText = expanded ? this.closeTitle : this.openTitle;
  newButtonText += '<span class="govuk-visually-hidden section-span"> '+ this.sectionTitle +'</span>';
  this.$openAllButton.setAttribute('aria-expanded', expanded);
  this.$openAllButton.innerHTML = newButtonText;
};

// Check for `window.sessionStorage`, and that it actually works.
var helper$1 = {
  checkForSessionStorage: function () {
    var testString = 'this is the test string';
    var result;
    try {
      window.sessionStorage.setItem(testString, testString);
      result = window.sessionStorage.getItem(testString) === testString.toString();
      window.sessionStorage.removeItem(testString);
      return result
    } catch (exception) {
      if ((typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.log('Notice: sessionStorage not available.');
      }
    }
  }
};

// Set the state of the accordions in sessionStorage
Accordion$1.prototype.storeState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    // We need a unique way of identifying each content in the accordion. Since
    // an `#id` should be unique and an `id` is required for `aria-` attributes
    // `id` can be safely used.
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = $button.getAttribute('aria-expanded');

      if (typeof contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria controls present in accordion section heading.'));
      }

      if (typeof contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria expanded present in accordion section heading.'));
      }

      // Only set the state when both `contentId` and `contentState` are taken from the DOM.
      if (contentId && contentState) {
        window.sessionStorage.setItem(contentId, contentState);
      }
    }
  }
};

// Read the state of the accordions from sessionStorage
Accordion$1.prototype.setInitialState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = contentId ? window.sessionStorage.getItem(contentId) : null;

      if (contentState !== null) {
        this.setExpanded(contentState === 'true', $section);
      }
    }
  }
};

function Tabs$1($module) {
  this.$module = $module;
  this.$tabs = $module.querySelectorAll('.idsk-tabs__tab');
  this.$mobileTabs = $module.querySelectorAll('.idsk-tabs__mobile-tab');

  this.keys = { left: 37, right: 39, up: 38, down: 40 };
  this.jsHiddenClass = 'idsk-tabs__panel--hidden';
  this.mobileTabHiddenClass = 'idsk-tabs__mobile-tab-content--hidden';
}

Tabs$1.prototype.init = function () {
  this.setup();
};

Tabs$1.prototype.setup = function () {
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $mobileTabs = this.$mobileTabs;
  var $tabList = $module.querySelector('.idsk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.idsk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.setAttribute('role', 'tablist');

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation');
  });

  nodeListForEach($mobileTabs, function ($item) {
    $item.setAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab, i) {
    // Set HTML attributes
    this.setAttributes($tab);

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this);

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true);
    $mobileTabs[i].addEventListener('click', $tab.boundTabClick, true);

    // Remove old active panels
    this.hideTab($tab);
  }.bind(this));

  // Show either the active tab according to the URL's hash or the first tab
  var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
  this.toggleMobileTab($activeTab);
  this.showTab($activeTab);

  // Handle hashchange events
  $module.boundOnHashChange = this.onHashChange.bind(this);
  window.addEventListener('hashchange', $module.boundOnHashChange, true);
};


Tabs$1.prototype.onHashChange = function (e) {
  var hash = window.location.hash;
  var $tabWithHash = this.getTab(hash);
  if (!$tabWithHash) {
    return
  }

  // Prevent changing the hash
  if (this.changingHash) {
    this.changingHash = false;
    return
  }

  // Show either the active tab according to the URL's hash or the first tab
  var $previousTab = this.getCurrentTab();

  this.hideTab($previousTab);
  this.showTab($tabWithHash);
  $tabWithHash.focus();
};

Tabs$1.prototype.hideTab = function ($tab) {
  this.unhighlightTab($tab);
  this.hidePanel($tab);
};

Tabs$1.prototype.showTab = function ($tab) {
  this.highlightTab($tab);
  this.showPanel($tab);
};

Tabs$1.prototype.toggleMobileTab = function ($tab, currentTab) {
  currentTab = currentTab || false;
  var $mobilePanel = this.getPanel($tab);
  var $mobileTab = $mobilePanel.previousElementSibling;
  $mobileTab.classList.toggle('idsk-tabs__mobile-tab--selected');
  $mobilePanel = $mobilePanel.querySelector('.idsk-tabs__mobile-tab-content');
  $mobilePanel.classList.toggle(this.mobileTabHiddenClass);
  if ($mobileTab.classList.contains('idsk-tabs__mobile-tab--selected') && currentTab) {
    $mobileTab.classList.remove('idsk-tabs__mobile-tab--selected');
    $mobilePanel.classList.add(this.mobileTabHiddenClass);
    $mobileTab.setAttribute('aria-expanded', 'false');
    $mobileTab.setAttribute('aria-label', $mobileTab.getAttribute('text-for-hide'));
  }
  else if ($mobileTab.classList.contains('idsk-tabs__mobile-tab--selected')) {
    $mobileTab.setAttribute('aria-expanded', 'true');
    $mobileTab.setAttribute('aria-label', $mobileTab.getAttribute('text-for-show'));
  }
  else {
    $mobileTab.setAttribute('aria-expanded', 'false');
    $mobileTab.setAttribute('aria-label', $mobileTab.getAttribute('text-for-hide'));
  }
};

Tabs$1.prototype.getTab = function (hash) {
  return this.$module.querySelector('.idsk-tabs__tab[href="' + hash + '"]')
};

Tabs$1.prototype.setAttributes = function ($tab) {
  // set tab attributes
  var panelId = this.getHref($tab).slice(1);
  var $mobileTab = this.$mobileTabs[$tab.getAttribute('item')];
  $tab.setAttribute('id', 'tab_' + panelId);
  $tab.setAttribute('role', 'tab');
  $tab.setAttribute('aria-controls', panelId);
  $tab.setAttribute('aria-selected', 'false');
  // set mobile tab attributes
  $mobileTab.setAttribute('id', 'tab_' + panelId);
  $mobileTab.setAttribute('role', 'tab');
  $mobileTab.setAttribute('aria-controls', panelId);
  $mobileTab.setAttribute('aria-selected', 'false');

  // set panel attributes
  var $panel = this.getPanel($tab);
  $panel.setAttribute('role', 'tabpanel');
  $panel.setAttribute('aria-labelledby', $tab.id);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs$1.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  var $mobileTab = this.$mobileTabs[$tab.getAttribute('item')];
  $tab.removeAttribute('id');
  $tab.removeAttribute('role');
  $tab.removeAttribute('aria-controls');
  $tab.removeAttribute('aria-selected');
  // unset mobile tab attributes
  $mobileTab.removeAttribute('id');
  $mobileTab.removeAttribute('role');
  $mobileTab.removeAttribute('aria-controls');
  $mobileTab.removeAttribute('aria-selected');

  // unset panel attributes
  var $panel = this.getPanel($tab);
  $panel.removeAttribute('role');
  $panel.removeAttribute('aria-labelledby');
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs$1.prototype.onTabClick = function (e) {
  if (!(e.target.classList.contains('idsk-tabs__tab') || e.target.classList.contains('idsk-tabs__mobile-tab') || e.target.classList.contains('idsk-tabs__tab-arrow-mobile'))) {
    // Allow events on child DOM elements to bubble up to tab parent
    return false
  }
  e.preventDefault();
  var $newTab = e.target;
  var $currentTab = this.getCurrentTab();

  if ($newTab.classList.contains('idsk-tabs__tab-arrow-mobile')) {
    $newTab = $newTab.parentElement;
  }
  if ($newTab.nodeName == 'BUTTON') {
    $newTab = this.$tabs[$newTab.getAttribute('item')];
    if ($newTab == $currentTab) {
      this.toggleMobileTab($currentTab);
    } else {
      this.toggleMobileTab($currentTab, true);
      this.toggleMobileTab($newTab);
    }
  }
  this.hideTab($currentTab);
  this.showTab($newTab);
  this.createHistoryEntry($newTab);
};

Tabs$1.prototype.createHistoryEntry = function ($tab) {
  var $panel = this.getPanel($tab);

  // Save and restore the id
  // so the page doesn't jump when a user clicks a tab (which changes the hash)
  var id = $panel.id;
  $panel.id = '';
  this.changingHash = true;
  window.location.hash = this.getHref($tab).slice(1);
  $panel.id = id;
};

Tabs$1.prototype.getPanel = function ($tab) {
  var $panel = this.$module.querySelector(this.getHref($tab));
  return $panel
};

Tabs$1.prototype.showPanel = function ($tab) {
  var $panel = this.getPanel($tab);
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs$1.prototype.hidePanel = function (tab) {
  var $panel = this.getPanel(tab);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs$1.prototype.unhighlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'false');
  this.$mobileTabs[$tab.getAttribute('item')].setAttribute('aria-selected', 'false');
  $tab.parentNode.classList.remove('idsk-tabs__list-item--selected');
};

Tabs$1.prototype.highlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'true');
  this.$mobileTabs[$tab.getAttribute('item')].setAttribute('aria-selected', 'true');
  $tab.parentNode.classList.add('idsk-tabs__list-item--selected');
};

Tabs$1.prototype.getCurrentTab = function () {
  return this.$module.querySelector('.idsk-tabs__list-item--selected .idsk-tabs__tab')
};

// this is because IE doesn't always return the actual value but a relative full path
// should be a utility function most prob
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
Tabs$1.prototype.getHref = function ($tab) {
  var href = $tab.getAttribute('href');
  var hash = href.slice(href.indexOf('#'), href.length);
  return hash
};

function Table ($module) {
    this.$module = $module;
  }

  Table.prototype.init = function () {
    this.setup();
  };

  Table.prototype.setup = function () {
    var $module = this.$module;

    if (!$module) {
        return
    }

    var $pritnTableBtn = $module.querySelector('.idsk-table__meta-print-button');
    if ($pritnTableBtn) {
      $pritnTableBtn.addEventListener('click', this.printTable.bind(this));
    }

  };

  Table.prototype.printTable = function () {
    var $table = this.$module.querySelector('.idsk-table').outerHTML;
    document.body.innerHTML = "<html><head><title></title></head><body>" + $table + "</body>";
    window.onafterprint = function (event) {window.location.reload();};
    window.print();
  };

function initExtended$1(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== "undefined" ? options : {};

  // Allow the user to initialise ID-SK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  var $feedback = scope.querySelectorAll(
    '[data-module="idsk-feedback"]'
  );
  nodeListForEach($feedback, function ($feedback) {
    new Feedback($feedback).init();
  });

  var $crossroad = scope.querySelectorAll('[data-module="idsk-crossroad"]');
  nodeListForEach($crossroad, function ($crossroad) {
    new Crossroad($crossroad).init();
  });

  var $inPageNavigation = scope.querySelector('[data-module="idsk-in-page-navigation"]');
  new InPageNavigation($inPageNavigation).init();

  var $searchComponents = scope.querySelectorAll('[data-module="idsk-search-component"]');
  nodeListForEach($searchComponents, function ($searchComponent) {
    new SearchComponent($searchComponent).init();
  });

  var $steppers = scope.querySelectorAll('[data-module="idsk-stepper"]');
  nodeListForEach($steppers, function ($stepper) {
    new Stepper($stepper).init();
  });

  var $registrationForEvents = scope.querySelectorAll('[data-module="idsk-registration-for-event"]');
  nodeListForEach($registrationForEvents, function ($registrationForEvent) {
    new RegistrationForEvent($registrationForEvent).init();
  });

  var $interactiveMaps = scope.querySelectorAll('[data-module="idsk-interactive-map"]');
  nodeListForEach($interactiveMaps, function ($interactiveMap) {
    new InteractiveMap($interactiveMap).init();
  });

  var $accordions = scope.querySelectorAll('[data-module="idsk-accordion"]');
  nodeListForEach($accordions, function ($accordion){
    new Accordion$1($accordion).init();
  });

  var $tabs = scope.querySelectorAll('[data-module="idsk-tabs"]');
  nodeListForEach($tabs, function ($tab){
    new Tabs$1($tab).init();
  });

  var $tables = scope.querySelectorAll('[data-module="idsk-table"]');
  nodeListForEach($tables, function ($table){
    new Table($table).init();
  });
    
  var $tableFilter = scope.querySelectorAll('[data-module="idsk-table-filter"]');
  nodeListForEach($tableFilter, function ($tableFilter) {
    new TableFilter($tableFilter).init();
  });

  var $subscriptionForms = scope.querySelectorAll('[data-module="idsk-subscription-form"]');
  nodeListForEach($subscriptionForms, function ($subscriptionForm) {
    new SubscriptionForm($subscriptionForm).init();
  });

  initCore$1(options);

  // Init all GOVUK components js
  initExtended(options);
}

function Header ($module) {
  this.$module = $module;
}

Header.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  if (!$module) {
    return
  }

  // Check for button
  var $toggleButton = $module.querySelector('.govuk-js-header-toggle');
  if (!$toggleButton) {
    return
  }

  // Handle $toggleButton click events
  $toggleButton.addEventListener('click', this.handleClick.bind(this));
};

/**
* Toggle class
* @param {object} node element
* @param {string} className to toggle
*/
Header.prototype.toggleClass = function (node, className) {
  if (node.className.indexOf(className) > 0) {
    node.className = node.className.replace(' ' + className, '');
  } else {
    node.className += ' ' + className;
  }
};

/**
* An event handler for click event on $toggleButton
* @param {object} event event
*/
Header.prototype.handleClick = function (event) {
  var $module = this.$module;
  var $toggleButton = event.target || event.srcElement;
  var $target = $module.querySelector('#' + $toggleButton.getAttribute('aria-controls'));

  // If a button with aria-controls, handle click
  if ($toggleButton && $target) {
    this.toggleClass($target, 'govuk-header__navigation--open');
    this.toggleClass($toggleButton, 'govuk-header__menu-button--open');

    $toggleButton.setAttribute('aria-expanded', $toggleButton.getAttribute('aria-expanded') !== 'true');
    $target.setAttribute('aria-hidden', $target.getAttribute('aria-hidden') === 'false');
  }
};

function initAll(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;
  
  // Find first header module to enhance.
  var $toggleButton = scope.querySelector('[data-module="govuk-header"]');
  new Header($toggleButton).init();

  initExtended(options);
}

function Header$1($module) {
  this.$module = $module;
}

Header$1.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  if (!$module) {
    return
  }

  // Check for button
  var $toggleButton = $module.querySelector('.govuk-js-header-toggle');
  if (!$toggleButton) {
    return
  }

  // Handle $toggleButton click events
  $toggleButton.addEventListener('click', this.handleClick.bind(this));
};

/**
* Toggle class
* @param {object} node element
* @param {string} className to toggle
*/
Header$1.prototype.toggleClass = function (node, className) {
  if (node.className.indexOf(className) > 0) {
    node.className = node.className.replace(' ' + className, '');
  } else {
    node.className += ' ' + className;
  }
};

/**
* An event handler for click event on $toggleButton
* @param {object} event event
*/
Header$1.prototype.handleClick = function (event) {
  var $module = this.$module;
  var $toggleButton = event.target || event.srcElement;
  var $target = $module.querySelector('#' + $toggleButton.getAttribute('aria-controls'));

  // If a button with aria-controls, handle click
  if ($toggleButton && $target) {
    this.toggleClass($target, 'idsk-header__navigation--open');
    this.toggleClass($toggleButton, 'idsk-header__menu-button--open');

    $toggleButton.setAttribute('aria-expanded', $toggleButton.getAttribute('aria-expanded') !== 'true');
    $target.setAttribute('aria-hidden', ($target.getAttribute('aria-hidden') === 'false').toString());
  }
};

/**
 * Header for extended websites
 */
function HeaderExtended($module) {
    this.$module = $module;
    this.$lastMenuElement = '';
    this.$firstMenuElement = '';
}

HeaderExtended.prototype.init = function () {

    var $module = this.$module;
    // check for module
    if (!$module) {
        return;
    }

    // check for search component
    var $searchComponents = $module.querySelectorAll('.idsk-header-extended__search');
    if ($searchComponents) {
        nodeListForEach($searchComponents, function ($searchComponent) {
            $searchComponent.addEventListener('change', this.handleSearchChange.bind(this));
            // trigger change event
            $searchComponent.dispatchEvent(new Event('change'));
        }.bind(this));
    }

    // check for language switcher
    var $toggleLanguageSwitchers = $module.querySelectorAll('.idsk-header-extended__language-button');
    if ($toggleLanguageSwitchers) {
        // Handle $toggleLanguageSwitcher click events
        nodeListForEach($toggleLanguageSwitchers, function ($toggleLanguageSwitcher) {
            $toggleLanguageSwitcher.addEventListener('click', this.handleLanguageSwitcherClick.bind(this));
            $toggleLanguageSwitcher.addEventListener('focus', this.handleLanguageSwitcherClick.bind(this));
        }.bind(this));

        // close language list if i left the last item from langauge list e.g. if user use tab key for navigations
        var $lastLanguageItems = $module.querySelectorAll('.idsk-header-extended__language-list-item:last-child .idsk-header-extended__language-list-link');
        nodeListForEach($lastLanguageItems, function ($lastLanguageItem) {
            $lastLanguageItem.addEventListener('blur', this.checkBlurLanguageSwitcherClick.bind(this));
        }.bind(this));

    }

    // check for menu items
    var $menuItems = $module.querySelectorAll('.idsk-header-extended__link');
    if ($menuItems) {
        // Handle $menuItem click events
        nodeListForEach($menuItems, function ($menuItem) {
            $menuItem.addEventListener('click', this.handleSubmenuClick.bind(this));
            $menuItem.addEventListener('focus', this.handleSubmenuClick.bind(this));
        }.bind(this));
    }

    // check for menu button and close menu button
    var $hamburgerMenuButton = $module.querySelector('.idsk-js-header-extended-side-menu');
    var $closeMenuButton = $module.querySelector('.idsk-header-extended__mobile-close');
    if ($hamburgerMenuButton && $closeMenuButton) {
        this.initMobileMenuTabbing();
        $hamburgerMenuButton.addEventListener('click', this.showMobileMenu.bind(this));
        $closeMenuButton.addEventListener('click', this.hideMobileMenu.bind(this));
    }

    window.addEventListener('scroll', this.scrollFunction.bind(this));

    $module.boundCheckBlurMenuItemClick = this.checkBlurMenuItemClick.bind(this);
    $module.boundCheckBlurLanguageSwitcherClick = this.checkBlurLanguageSwitcherClick.bind(this);

    // check for cookies

    if (!(window.localStorage.getItem('acceptedCookieBanner'))) {
        $module.classList.add('idsk-header-extended--cookie');
        var $cookieBanner = document.querySelector('.idsk-cookie-banner');

        if ($cookieBanner) {
            // scroll handler
            window.addEventListener('scroll', function () {
                var headerPosition = document.body.getBoundingClientRect().top;
                var cookieBannerHeight = $cookieBanner.offsetHeight;
                if (headerPosition < (-cookieBannerHeight)) {
                    $module.classList.remove('idsk-header-extended--cookie');
                    $module.style.top = '0px';
                } else {
                    $module.classList.add('idsk-header-extended--cookie');
                    $module.style.top = cookieBannerHeight.toString() + 'px';
                }
            });

            // cookie resize handler
            var resizeObserver = new ResizeObserver(function () {
                $module.style.top = $cookieBanner.offsetHeight.toString() + 'px';
            });

            resizeObserver.observe($cookieBanner);
        }

    }

};

/**
 * Hide label if search input is not empty
 * @param {object} e
 */
HeaderExtended.prototype.handleSearchChange = function (e) {
    var $searchInput = e.target || e.srcElement;
    var $search = $searchInput.closest('.idsk-header-extended__search');
    var $searchLabel = $search.querySelector('label');
    if ($searchInput.value) {
        $searchLabel.classList.add('idsk-header-extended__search-input--focus');
    } else {
        $searchLabel.classList.remove('idsk-header-extended__search-input--focus');
    }
};

/**
 * Handle open/hide language switcher
 * @param {object} e
 */
HeaderExtended.prototype.handleLanguageSwitcherClick = function (e) {
    var $toggleButton = e.target || e.srcElement;
    //var $target = $toggleButton.closest('.idsk-header-extended__language');
    this.$activeSearch = $toggleButton.closest('.idsk-header-extended__language');
    toggleClass(this.$activeSearch, 'idsk-header-extended__language--active');
    document.addEventListener('click', this.$module.boundCheckBlurLanguageSwitcherClick, true);
};

/**
 * handle click outside language switcher or "blur" the item link
 */
HeaderExtended.prototype.checkBlurLanguageSwitcherClick = function () {
    //var $target = this.$module.querySelectorAll('.idsk-header-extended__language');
    this.$activeSearch.classList.remove('idsk-header-extended__language--active');
    document.removeEventListener('click', this.$module.boundCheckBlurLanguageSwitcherClick, true);
};

/**
 * Handle open/hide submenu
 * @param {object} e
 */
HeaderExtended.prototype.handleSubmenuClick = function (e) {
    var $srcEl = e.target || e.srcElement;
    var $toggleButton = $srcEl.closest('.idsk-header-extended__navigation-item');
    var $currActiveList = this.$module.querySelectorAll('.idsk-header-extended__navigation-item--active');

    if ($currActiveList.length > 0) {
        $currActiveList[0].classList.remove('idsk-header-extended__navigation-item--active');
    }
    toggleClass($toggleButton, 'idsk-header-extended__navigation-item--active');

    document.addEventListener('click', this.$module.boundCheckBlurMenuItemClick, true);
};

/**
 * handle click outside menu or "blur" the item link
 */
HeaderExtended.prototype.checkBlurMenuItemClick = function () {
    var $currActiveList = this.$module.querySelectorAll('.idsk-header-extended__navigation-item--active');
    $currActiveList[0].classList.remove('idsk-header-extended__navigation-item--active');
    document.removeEventListener('click', this.$module.boundCheckBlurMenuItemClick, true);
};

/**
 * Show mobile menu
 * @param {object} e
 */
HeaderExtended.prototype.showMobileMenu = function (e) {
    var $hamburgerMenuButton = this.$module.querySelector('.idsk-js-header-extended-side-menu');

    this.$module.classList.add("idsk-header-extended--show-mobile-menu");
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    if (document.activeElement == $hamburgerMenuButton) {
        this.$lastMenuElement.focus();
    }
};
/**
 * Hide mobile menu
 * @param {object} e
 */
HeaderExtended.prototype.hideMobileMenu = function (e) {
    var $hamburgerMenuButton = this.$module.querySelector('.idsk-js-header-extended-side-menu');

    this.$module.classList.remove("idsk-header-extended--show-mobile-menu");
    document.getElementsByTagName("body")[0].style.overflow = "visible";
    $hamburgerMenuButton.focus();
};

/**
 * Create loop in mobile menu for tabbing elements
 */
HeaderExtended.prototype.initMobileMenuTabbing = function () {
    //Get header extended mobile menu focusable elements
    var $headerExtended = this.$module.querySelectorAll('.idsk-header-extended__mobile')[0];
    var $mobileMenuElements = $headerExtended.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    this.$firstMenuElement = $mobileMenuElements[0];
    this.$lastMenuElement = $mobileMenuElements[$mobileMenuElements.length - 1];
    var KEYCODE_TAB = 9;

    document.addEventListener('keydown', function (e) {
        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { // shift + tab
            if (document.activeElement === this.$firstMenuElement) {
                this.$lastMenuElement.focus();
                e.preventDefault();
            }
        } else if (document.activeElement === this.$lastMenuElement) { // tab
            this.$firstMenuElement.focus();
            e.preventDefault();
        }

    }.bind(this));
};

/**
 * When the user scrolls down from the top of the document, resize the navbar's padding and the logo
 */
HeaderExtended.prototype.scrollFunction = function () {
    var $module = this.$module;

    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        $module.classList.add('idsk-header-extended--shrink');
    } else if (document.body.scrollTop < 10 && document.documentElement.scrollTop < 10) {
        $module.classList.remove('idsk-header-extended--shrink');
    }
};

function SearchResultsFilter($module) {
    this.$module = $module;
}

SearchResultsFilter.prototype.init = function () {
    // Check for module
    var $module = this.$module;
    if (!$module) {
        return
    }

    var $linkPanelButtons = $module.querySelectorAll('.idsk-search-results__link-panel-button');
    if (!$linkPanelButtons) {
        return
    }

    var $topicSearchInput = $module.querySelector('#idsk-search-input__topic');
    if ($topicSearchInput) {
        $topicSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'radios'));
    }

    var $subtopicSearchInput = $module.querySelector('#idsk-search-input__subtopic');
    if ($subtopicSearchInput) {
        $subtopicSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'radios'));
    }

    var $contentTypeSearchInput = $module.querySelector('#idsk-search-input__content-type');
    if ($contentTypeSearchInput) {
        $contentTypeSearchInput.addEventListener('keyup', this.handleSearchItemsFromInput.bind(this, 'checkboxes'));
    }

    var $radioButtonsInput = $module.querySelectorAll('.idsk-search-results__filter .govuk-radios__input ');
    if (!$radioButtonsInput) {
        return
    }

    var $contentTypeCheckBoxes = $module.querySelectorAll('.idsk-search-results__filter .govuk-checkboxes__input ');
    if (!$contentTypeCheckBoxes) {
        return
    }

    $radioButtonsInput.forEach(function ($input) {
        $input.addEventListener('click', this.handleClickRadioButton.bind(this), true);
    }.bind(this));

    $contentTypeCheckBoxes.forEach(function ($checkBox) {
        $checkBox.addEventListener('click', this.handleClickContentTypeCheckBox.bind(this), true);
    }.bind(this));

    $linkPanelButtons.forEach(function ($button) {
        $button.addEventListener('click', this.handleClickLinkPanel.bind(this));
    }.bind(this));
};

SearchResultsFilter.prototype.handleClickRadioButton = function (e) {
    var $el = e.target || e.srcElement;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');
    var $buttonCaption = $linkPanelButton.querySelector('.idsk-search-results__link-panel--span');

    $buttonCaption.innerText = '1 vybraté';
};

SearchResultsFilter.prototype.handleClickContentTypeCheckBox = function (e) {
    var $el = e.target || e.srcElement;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');
    var $checkBoxes = $el.closest('.govuk-checkboxes');

    this.handleCountOfPickedContentTypes.call(this, $checkBoxes, $linkPanelButton);
};

SearchResultsFilter.prototype.handleCountOfPickedContentTypes = function ($checkBoxes, $linkPanelButton) {
    var $buttonCaption = $linkPanelButton.querySelector('.idsk-search-results__link-panel--span');
    var $counter = 0;

    if ($checkBoxes) {
        $checkBoxes.querySelectorAll('.govuk-checkboxes__input').forEach(function ($checkBox) {
            if ($checkBox.checked) {
                $counter = $counter + 1;
            }
        }.bind(this));
    }
    if ($counter == 0) {
        $buttonCaption.innerText = '';
    } else {
        $buttonCaption.innerText = $counter + ' vybraté';
    }
};

SearchResultsFilter.prototype.handleSearchItemsFromInput = function ($type, e) {
    var $el = e.target || e.srcElement;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');
    var $items = $linkPanelButton.querySelectorAll('.govuk-' + $type + '__item');
    $items.forEach(function ($item) {
        $item.classList.remove('idsk-search-results--invisible');
    }.bind(this));
    $items.forEach(function ($item) {
        var $labelItem = $item.querySelector('.govuk-' + $type + '__label');

        if (!$labelItem.innerText.toLowerCase().includes($el.value.toLowerCase())) {
            $item.classList.add('idsk-search-results--invisible');
        }
    }.bind(this));
};

/**
 * An event handler for click event on $linkPanel - collapse or expand filter
 * @param {object} e
 */
SearchResultsFilter.prototype.handleClickLinkPanel = function (e) {
    var $el = e.target || e.srcElement;
    var $linkPanelButton = $el.closest('.idsk-search-results__link-panel');
    var $contentPanel = $linkPanelButton.querySelector('.idsk-search-results__list');
    var $ariaLabelComponent = $el.closest('.idsk-search-results__link-panel-button');

    toggleClass($contentPanel, 'idsk-search-results--hidden');
    toggleClass($linkPanelButton, 'idsk-search-results--expand');
    if ($linkPanelButton.classList.contains('idsk-search-results--expand')) {
        $ariaLabelComponent.setAttribute('aria-expanded', 'true');  
        $ariaLabelComponent.setAttribute('aria-label', $ariaLabelComponent.getAttribute('data-text-for-hide')); 
    } else {
        $ariaLabelComponent.setAttribute('aria-expanded', 'false');
        $ariaLabelComponent.setAttribute('aria-label', $ariaLabelComponent.getAttribute('data-text-for-show'));
    }
};

function initAll$1(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== "undefined" ? options : {};

  // Allow the user to initialise ID-SK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  var $headers = scope.querySelectorAll('[data-module="idsk-header"]');
  nodeListForEach($headers, function ($headers) {
    new Header$1($headers).init();
  });

  // Find first Header-extended module to enhance.
  var $headersExtended = scope.querySelectorAll('[data-module="idsk-header-extended"]');
  nodeListForEach($headersExtended, function ($headerExtended) {
    new HeaderExtended($headerExtended).init();
  });

  var $searchResultsFilters = scope.querySelectorAll('[data-module="idsk-search-results-filter"]');
  nodeListForEach($searchResultsFilters, function ($searchResultsFilter) {
    new SearchResultsFilter($searchResultsFilter).init();
  });

  initExtended$1(options);

  // Init all GOVUK components js
  initAll(options);
}

exports.initAll = initAll$1;
exports.Header = Header$1;
exports.HeaderExtended = HeaderExtended;
exports.SearchResultsFilter = SearchResultsFilter;

})));
