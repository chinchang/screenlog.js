# screenlogx (forked from https://github.com/chinchang/screenlog.js)

_Bring console.log, on the screen_

---

Ever faced a situation where you said "Why doesn't this bug show up when developer console is open!!"? And since the bug doesn't show when you have console open, you cannot do debug logging using `console.log`.

Enter `screenlog.js`. `screenlog.js` brings the developer console right on your screen so that you can do logging without having the developer console open always.

### [Example](https://github.com/chinchang/screenlog.js/blob/master/example.html)

![Screenshot](/screenshot.gif)

## Usage

Do `npm install screenlog` or `bower install screenlog` or [download the project](https://github.com/chinchang/screenlog.js/archive/master.zip).

Drop `dist/screenlog.min.js` into your web application and initialize it with:

```js
screenLog.init();
```

And you are done!
**By default, every next `console.log` (or info, warn and error) in your app now starts logging on the screen as well as the console. Or you can use `screenLog.log()` instead to just log on the screen.**

## Public API

### screenLog.init([options])

Initializes the screen logger. It creates a customizable panel on the screen.

- `options` - A map of additional options.
- `logColor` - Text color. Default is `lightgreen`.
- `fontSize` - Font size of logs. Default is `1em`(Your browser's default).
- `bgColor` - Background color of the log panel. Default is `black`.
- `releaseConsole` - By default console.log is overridden to log on screen. You can avoid this behaviour by setting `releaseConsole` to `true` and instead use `screenLog.log()` API. Default is `false`.
- `minLogLevel` - minimum log level that to be displayed on the screen. Can beL `log`, `info`, `warn`, `error`. Default is `warn`
- `getVisualArgs` - function to allow visual log param customisation: function(logLevel, args) { ... return newArguments; }

### screenLog.[log, warn, error, info](obj1 [, obj2, ..., objN])

Logs a message on the screen. Eg. `screenLog.info('Info here')`.

- `obj1 ... objN` - A list of JavaScript objects or strings to output. Just like `console.log`.

### screenLog.clear()

Clears messages on the screen.

### screenLog.destroy()

Removes the logger from the UI and reverts to original console functionality.

## Browser Support

**screenlog.js** works best on latest versions of Google Chrome, Firefox and Safari.

## Contributing

Interested in contributing features and fixes?

[Read more on contributing](./CONTRIBUTING.md).

## Changelog

See the [Changelog](https://github.com/chinchang/screenlog.js/wiki/Changelog)

## License

Copyright (c) 2015-2021 Kushagra Gour, https://kushagra.dev
Licensed under the [MIT license](http://opensource.org/licenses/MIT).
