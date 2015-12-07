(function () {

	var logEl,
		isInitialized = false,
		_console = {}; // backup console obj to contain references of overridden fns.

	function createElement( tag, css ) {
		var element = document.createElement( tag );
		element.style.cssText = css;
		return element;
	}

	function createPanel(options) {
		options.bgColor = options.bgColor || 'black';
		options.color = options.color || 'lightgreen';
		options.css = options.css || '';
		var div = createElement( 'div', 'font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;padding:5px;text-align:left;opacity:0.8;position:fixed;right:0;top:0;min-width:200px;max-height:50vh;overflow:auto;background:' + options.bgColor + ';color:' + options.color + ';' + options.css);
		return div;
	}

	function log() {
		var el = createElement( 'div', 'line-height:18px;background:' +
			(logEl.children.length % 2 ? 'rgba(255,255,255,0.1)' : '')); // zebra lines
		var val = [].slice.call(arguments).reduce(function(prev, arg) {
			return prev + ' ' + arg;
		}, '');
		el.textContent = val;

		logEl.appendChild(el);
		// Scroll to last element
		logEl.scrollTop = logEl.scrollHeight - logEl.clientHeight;
	}

	function clear() {
		logEl.innerHTML = '';
	}

	function init(options){
		if (isInitialized) { return; }

		isInitialized = true;
		options = options || {};
		logEl = createPanel(options);
		document.body.appendChild(logEl);

		if (!options.freeConsole) {
			// Backup actual fns to keep it working together
			_console.log = console.log;
			_console.clear = console.clear;
			console.log = originalFnCallDecorator(log, 'log');
			console.clear = originalFnCallDecorator(clear, 'clear');
		}
	}

	function destroy() {
		isInitialized = false;
		console.log = _console.log;
		console.clear = _console.clear;
		logEl.remove();
	}

	/**
	 * Checking if isInitialized is set
	 */
	function checkInitialized(){
		if (!isInitialized){
			throw 'You need to call `screenLog.init()` first.';
		}
	}

	/**
	 * Decorator for checking if isInitialized is set
	 * @param  {Function} fn Fn to decorate
	 * @return {Function}      Decorated fn.
	 */
	function checkInitDecorator(fn){
		return function(){
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
		return function(){
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
		destroy: checkInitDecorator(destroy)
	};
})();
