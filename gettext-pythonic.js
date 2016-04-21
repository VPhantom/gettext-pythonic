/*! gettext-pythonic v1.1.2
 * <https://github.com/vphantom/gettext-pythonic>
 * Copyright 2016 Stéphane Lavergne
 * Free software under MIT License: <https://opensource.org/licenses/MIT> */

/**
 * gettext-pythonic: Tiny po2json-compatible gettext with variable substitution
 *
 * See README.md for details.
 *
 * @package   gettext-pythonic
 * @author    Stéphane Lavergne <http://www.imars.com/>
 * @copyright 2016 Stéphane Lavergne
 * @license   https://opensource.org/licenses/MIT  MIT
 */

"use strict";

var gettext = {};

gettext._formatRE    = /%\{([^}]+)\}/g;
gettext._pluralRE    = /nplurals=(\d+);\s+plural=([^;]+);/;
gettext._npluralsDef = 2;  // Not currently used
gettext._pluralDef   = function(n) {
  return +(Math.abs(n) != 1);  // eslint-disable-line eqeqeq
};

gettext._lang     = {};
gettext._nplurals = gettext._npluralsDef;
gettext._plural   = gettext._pluralDef;

gettext.ngettext = function(singular, plural, count, args) {
  // Our target is singular or its translation (possibly an array)
  var res = (
    singular in gettext._lang
    ? (gettext._lang[singular] || singular)
    : singular
  );

  // Plural: choose right form from array or plural argument
  if (typeof res === "object") {
    res = res[gettext._plural(count) + 1] || res[1] || singular;
  } else if (typeof plural === "string" && gettext._plural(count)) {
    res = plural;
  }

  // Pythonic substitutions
  if (args !== null && typeof args === "object") {
    res = res.replace(gettext._formatRE, function(z, key) {
      return (key in args ? args[key] : "");
    });
  }

  return res;
};

gettext.gettext = function(target, args) {
  return gettext.ngettext(target, null, null, args);
};

gettext.load = function(newLang) {
  var src = [];

  gettext._lang = (typeof newLang === "object" ? newLang : {});

  try {
    src = gettext._lang[""]["plural-forms"].match(gettext._pluralRE);
    gettext._nplurals = src[1];
    gettext._plural = new Function(
      "n",
      "n = Math.abs(n); return +(" + src[2] + ")"
    );
  } catch (e) {
    gettext._nplurals = gettext._npluralsDef;
    gettext._plural = gettext._pluralDef;
  }
};

module.exports = gettext;
