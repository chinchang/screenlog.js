(function() {
  var logEl,
    isInitialized = false,

    _console = {}; // backup console obj to contain references of overridden fns.

  _options = {
    bgColor: "#F5F5F5",
    logColor: "lightgreen",
    infoColor: "blue",
    warnColor: "orange",
    errorColor: "red",
    fontSize: "1em",
    freeConsole: false,
    css: "",
    autoScroll: true
  };

  _colors = {
    warn:"background-color: #ffff00;",
    info:"background-color: #75b6e7;",
    error:"background-color: #EF5350;",
    assert:"background-color: #AB47BC;",
    log:"background-color: #64DD17;"
  }

  _icons = {
    warn:'<i class="fa fa-light fa-triangle-exclamation fa-lg"></i>',
    debug:'<i class="fa fa-light fa-code fa-lg"></i>',
    error:'<i class="fa fa-light fa-bug fa-lg"></i>',
    assert:'<i class="fa-solid fa-a fa-lg"></i>',
    log:'<i class="fa fa-light fa-circle-info fa-lg"></i>'
  }

  function createElement(tag, css) {
    var element = document.createElement(tag);
    
    element.style.cssText = css;
    
    return element;
  }

  function createPanel() {
    var div = createElement(
      "div",
      "z-index:2147483647;font-family:Helvetica,Arial,sans-serif;font-size:" +
        _options.fontSize +
        ";padding:5px;text-align:left;opacity:0.8;position:fixed;right:0;top:0;min-width:250px;max-height:50vh;overflow:auto;background:" +
        _options.bgColor +
        ";" +
        _options.css
    );
    
    return div;
  }

  function genericLogger(color, errorType) {
    return function() {

      var imgElement = document.createElement("img");
      imgElement.style.cssText = "z-index:2147483647;height:20px;width:20px;margin-left:6px;";
      imgElement.src = "./assets/twitter.png";

      var el = createElement(
        "div",
        "display:flex;align-items:center;line-height:3em;min-height:3em;background:" +
          (logEl.children.length % 2 ? "rgba(255,255,255,0.1)" : "") +
          ";color:" +
          color
      ); // zebra lines

      var el1 = createElement(
        "div",
        "display: flex;height: 24px;width: 240px;align-items: center;" + _colors[errorType]
      );


      var val = [].slice.call(arguments).reduce(function(prev, arg) {
        return (
          prev + " " + (typeof arg === "object" ? JSON.stringify(arg) : arg)
        );
      }, "");
     
      el1.textContent = val;
      //el1.appendChild(imgElement);
      logEl.appendChild(el1);
      

      // Scroll to last element, if autoScroll option is set.
      if (_options.autoScroll) {
        logEl.scrollTop = logEl.scrollHeight - logEl.clientHeight;
      }
    };
  }

  function clear() {
    logEl.innerHTML = "";
  }

  function log() {
    return genericLogger(_options.logColor, "log").apply(null, arguments);
  }

  function info() {
    return genericLogger(_options.infoColor, "info").apply(null, arguments);
  }

  function warn() {
    return genericLogger(_options.warnColor, "warn").apply(null, arguments);
  }

  function error() {
    return genericLogger(_options.errorColor, "error").apply(null, arguments);
  }

  function setOptions(options) {
    for (var i in options)
      if (options.hasOwnProperty(i) && _options.hasOwnProperty(i)) {
        _options[i] = options[i];
      }
  }

  function init(options) {
    if (isInitialized) {
      return;
    }

    isInitialized = true;

    if (options) {
      setOptions(options);
    }

    logEl = createPanel();
    document.body.appendChild(logEl);

    if (!_options.freeConsole) {
      // Backup actual fns to keep it working together
      _console.log = console.log;
      _console.clear = console.clear;
      _console.info = console.info;
      _console.warn = console.warn;
      _console.error = console.error;
      console.log = originalFnCallDecorator(log, "log");
      console.clear = originalFnCallDecorator(clear, "clear");
      console.info = originalFnCallDecorator(info, "info");
      console.warn = originalFnCallDecorator(warn, "warn");
      console.error = originalFnCallDecorator(error, "error");
    }
  }

  function destroy() {
    isInitialized = false;
    console.log = _console.log;
    console.clear = _console.clear;
    console.info = _console.info;
    console.warn = _console.warn;
    console.error = _console.error;
    logEl.remove();
  }

  /**
   * Checking if isInitialized is set
   */
  function checkInitialized() {
    if (!isInitialized) {
      throw "You need to call `screenLog.init()` first.";
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
      if (typeof _console[fnName] === "function") {
        _console[fnName].apply(console, arguments);
      }
    };
  }

  // Public API
  window.screenLog = {
    init: init,
    log: originalFnCallDecorator(checkInitDecorator(log), "log"),
    clear: originalFnCallDecorator(checkInitDecorator(clear), "clear"),
    info: originalFnCallDecorator(checkInitDecorator(clear), "info"),
    warn: originalFnCallDecorator(checkInitDecorator(warn), "warn"),
    error: originalFnCallDecorator(checkInitDecorator(error), "error"),
    destroy: checkInitDecorator(destroy)
  };
})();
