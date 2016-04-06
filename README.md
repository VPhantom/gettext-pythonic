# gettext-pythonic

Tiny [po2json](https://github.com/mikeedwards/po2json)-compatible gettext with variable substitution.

## CAUTION: Refactor in progress!

> This module is currently being refactored to play nice with Underscore.JS and implement plural forms.  Please wait for release 1.0 before using in production!

This module allows you to use xgettext to build POT files, poedit (or online alternatives) to create PO translations, [po2json](https://github.com/mikeedwards/po2json) at build time to create JavaScript-friendly JSON representations of those PO files, while using a simple gettext() or _() invocation.

This is a simplification of some of the ideas found at [localeplanet.com](http://www.localeplanet.com/). **It does not handle plural forms!**  If you'd like actual conformance with gettext's handling of plural forms (at the expense of this one's friendly variable substitution), see [Jed](https://github.com/SlexAxton/Jed).

Instead of going for a sprintf() means of substituting variables, which couldn't be reordered, I've gone for ["pythonic string formatting"](http://davedash.com/2010/11/19/pythonic-string-formatting-in-javascript/) with an added percentage to help translators, which makes both of the following possible:

```js
__("Talking about %{0} and %{1}.", [somevar, othervar]);
__("Talking about %{foo} and %{bar}.", {'foo': somevar, 'bar': othervar});
```

## Usage

### Server-side, build time

Maintain your English PO template the standard way:

```sh
xgettext -L JavaScript -o locales/messages.pot ...files...
```

...then use, for example, poedit to maintain the translations, such as a `locales/fr.po` for example.

...then use [po2json](https://github.com/mikeedwards/po2json) to generate the JSON equivalent of each non-English PO file:

```sh
po2json locales/fr.po htdocs/locale_fr.json --fuzzy
```

#### Basic JSON

Note that if all you need is a quick and dirty 1:1 translation with substitutions, you don't need to use gettext and po2json: a simple object where each key is a source string and each value is the translated version, will also work (including variable substitution).

### Client-side

Here, `window.gettext` and `window.__` are created for you:

```html
<script src="gettext-pythonic.js"></script>
...
<script type="text/javascript"><!--
  gettext.load(FIXMEsomeJSONdata);
  var text = __("This sentence is in English.");
// --></script>
```

### Node.JS

In Node.JS, you can choose whichever name you'd like, although keep in mind that if you intend to build your JSON languages with xgettext and po2json, you'll need to call it __() or gettext().

```js
var __ = require('gettext-pythonic');
...
__.load(require('locales/fr.json'));
console.log(__("This sentence is in English."));
```
