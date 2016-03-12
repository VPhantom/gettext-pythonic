# node-gettext-pythonic

Tiny [po2json](https://github.com/mikeedwards/po2json)-compatible gettext with variable substitution.

This module allows you to use xgettext to build POT files, poedit (or online alternatives) to create PO translations, [po2json](https://github.com/mikeedwards/po2json) at build time to create JavaScript-friendly JSON representations of those PO files, while using a simple gettext() or _() invocation.

This is a simplification of some of the ideas found at [localeplanet.com](http://www.localeplanet.com/). **It does not handle plural forms!**  If you'd like actual conformance with gettext's handling of plural forms (at the expense of this one's friendly variable substitution), see [Jed](https://github.com/SlexAxton/Jed).

Instead of going for a sprintf() means of substituting variables, which couldn't be reordered, I've gone for ["pythonic string formatting"](http://davedash.com/2010/11/19/pythonic-string-formatting-in-javascript/) which makes both of the following possible:

	_("Talking about {0} and {1}.", [somevar, othervar]);
	_("Talking about {foo} and {bar}.", {'foo': somevar, 'bar': othervar});

## Usage

### Client-side

Here, `window._` is created for you:

	<script src="gettext-pythonic.js"></script>
	...
	<script type="text/javascript"><!--
	  var text = _("This sentence is in English.");
	// --></script>

### Node.JS

In Node.JS, you can choose whichever name you'd like, although keep in mind that if you intend to build your JSON languages with xgettext and po2json, you'll need to call it _() or gettext().

	var _ = require('gettext-pythonic');
	...
	console.log("This sentence is in English.");

## TODO

- [ ] Clean up and publish on NPM
