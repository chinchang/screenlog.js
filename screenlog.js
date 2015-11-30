(function () {

	var logEl,
		isInitialized = false;

	function createElement( tag, css ) {
		var element = document.createElement( tag );
		element.style.cssText = css;
		return element;
	}

	function createPanel(options) {
		checkInitialized();

		options = options || {};
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
		isInitialized = true;
		options = options || {};
		logEl = createPanel(options);
		document.body.appendChild(logEl);

		if (!options.freeConsole) {
			console.log = log;
			console.clear = clear;
		}
	}

	/**
	 * Checking if isInitialized is set
	 */
	function checkInitialized(){
		if(!isInitialized){
			throw 'You need to call `screenLog.init()` first.';
		}
	}

	/**
	 */
	/**
	 * Decorator for checking if isInitialized is set
	 * @param  {Function} fn Fn to decorate
	 */
	function checkInitDecorator(fn){
		return function(){
			checkInitialized();
			return fn.apply(this, arguments);
		};
	}

	// Public API
	window.screenLog = {
		init: init,
		log: checkInitDecorator(log),
		clear: checkInitDecorator(clear)
	};
})();
