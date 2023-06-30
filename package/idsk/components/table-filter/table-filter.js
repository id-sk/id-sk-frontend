(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
	(global.GOVUKFrontend = factory());
}(this, (function () { 'use strict';

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

return TableFilter;

})));
