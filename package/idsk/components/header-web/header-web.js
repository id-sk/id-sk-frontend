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

return HeaderWeb;

})));
