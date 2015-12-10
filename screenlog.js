(function () {
	
	var logEl,
		isInitialized = false,
		_console = {}, // backup console obj to contain references of overridden fns.
		_options = {
						bgColor: 'black',
						logColor: 'lightgreen',
						warnColor: 'orange',
						errorColor: 'red',
						freeConsole: false,
						css: '',
						autoScroll: true,
						draggable: true
					};
	
	function createElement(tag, css) {
		var element = document.createElement(tag);
		element.style.cssText = css;
		return element;
	}
	
	function createPanel() {
		var div = createElement('div', 'font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;padding:5px;text-align:left;opacity:0.8;position:fixed;right:0;top:0;z-index:1000;min-width:200px;max-height:50vh;overflow:auto;background:' + _options.bgColor + ';' + _options.css);
		
		if(_options.draggable) {
			div.onmousedown = function(e) {
				var offsetX = this.offsetLeft - e.clientX;
				var offsetY = this.offsetTop - e.clientY;
				
				this.onmousemove = function(e) { this.style.top = (e.clientY + offsetY) + "px"; this.style.right = (window.innerWidth - (e.clientX + offsetX + this.offsetWidth)) + "px"; };
			};
			div.onmouseup = function(e) { this.onmousemove = null; };
		}
		
		return div;
	}
	
	function genericLogger(color) {
		return function() {
			var el = createElement('div', 'line-height:18px;min-height:18px;background:' +
				(logEl.children.length % 2 ? 'rgba(255,255,255,0.1)' : '') + ';color:' + color); // zebra lines
			var val = [].slice.call(arguments).reduce(function(prev, arg) {
				return prev + ' ' + (typeof arg === "object" ? JSON.stringify(arg) : arg);
			}, '');
			el.textContent = val;
			
			logEl.appendChild(el);
			
			// Scroll to last element, if autoScroll option is set.
			if(_options.autoScroll) logEl.scrollTop = logEl.scrollHeight - logEl.clientHeight;
		};
	}
	
	function clear() {
		logEl.innerHTML = '';
	}
	
	function log() {
		return genericLogger(_options.logColor).apply(null, arguments);
	}
	
	function warn() {
		return genericLogger(_options.warnColor).apply(null, arguments);
	}
	
	function error() {
		return genericLogger(_options.errorColor).apply(null, arguments);
	}
	
	function setOptions(options) {
		for(var i in options)
			if(options.hasOwnProperty(i) && _options.hasOwnProperty(i))
				_options[i] = options[i];
	}
	
	function init(options) {
		if (isInitialized) { return; }
		
		isInitialized = true;
		
		if(options) { setOptions(options) };
		
		logEl = createPanel();
		document.body.appendChild(logEl);
		
		if (!_options.freeConsole) {
			// Backup actual fns to keep it working together
			_console.log = console.log;
			_console.clear = console.clear;
			_console.warn = console.warn;
			_console.error = console.error;
			console.log = originalFnCallDecorator(log, 'log');
			console.clear = originalFnCallDecorator(clear, 'clear');
			console.warn = originalFnCallDecorator(warn, 'warn');
			console.error = originalFnCallDecorator(error, 'error');
		}
	}

	function destroy() {
		isInitialized = false;
		console.log = _console.log;
		console.clear = _console.clear;
		console.warn = _console.warn;
		console.error = _console.error;
		logEl.remove();
	}

	/**
	 * Checking if isInitialized is set
	 */
	function checkInitialized() {
		if (!isInitialized) {
			throw 'You need to call `screenLog.init()` first.';
		}
	}

	/**
	 * Decorator for checking if isInitialized is set
	 * @param  {Function} fn Fn to decorate
	 * @return {Function}      Decorated fn.
	 */
	function checkInitDecorator(fn) {
		return function() {
			checkInitialized();
			return fn.apply(this, arguments);
		};
	}

	/**
	 * Decorator for calling the original console's fn at the end of
	 * our overridden fn definitions.
	 * @param  {Function} fn Fn to decorate
	 * @param  {string} fn Name of original function
	 * @return {Function}      Decorated fn.
	 */
	function originalFnCallDecorator(fn, fnName) {
		return function() {
			fn.apply(this, arguments);
			if (typeof _console[fnName] === 'function') {
				_console[fnName].apply(console, arguments);
			}
		};
	}

	// Public API
	window.screenLog = {
		init: init,
		log: originalFnCallDecorator(checkInitDecorator(log), 'log'),
		clear: originalFnCallDecorator(checkInitDecorator(clear), 'clear'),
		warn: originalFnCallDecorator(checkInitDecorator(warn), 'warn'),
		error: originalFnCallDecorator(checkInitDecorator(error), 'error'),
		destroy: checkInitDecorator(destroy)
	};
})();
