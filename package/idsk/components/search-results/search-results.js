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
    if ($linkPanelButton.classList.contains('idsk-search-results--expand')) {
        $el.setAttribute('aria-expanded', 'true');
    } else {
        $el.setAttribute('aria-expanded', 'false');
    }
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

return SearchResults;

})));
