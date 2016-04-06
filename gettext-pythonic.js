/*! gettext-pythonic
 * Copyright 2016 Stéphane Lavergne <http://www.imars.com/>
 * Free software under <http://www.gnu.org/licenses/lgpl-3.0.txt> */

/**
 * gettext-pythonic: Tiny po2json-compatible gettext with variable substitution
 *
 * See README.md for details.
 *
 * @package   gettext-pythonic
 * @author    Stéphane Lavergne <http://www.imars.com/>
 * @copyright 2016 Stéphane Lavergne
 * @license   http://www.gnu.org/licenses/lgpl-3.0.txt  GNU LGPL version 3
 */

"use strict";

(function(window) {
  var gt;

  gt = function(target, args) {
    return gt.ngettext(target, null, null, args);
  };

  gt._formatRE = /%\{([^}]+)\}/g;
  gt._pluralRE = /nplurals=(\d+);\s+plural=([^;]+);/;
  gt._lang = null;
  gt._nplurals = 2;  // Not currently used
  gt._plural = function(n) {
    return +(n != 1);  // eslint-disable-line eqeqeq
  };

  gt.ngettext = function(singular, plural, count, args) {
    var res = (
      gt._lang !== null && singular in gt._lang
      ? (gt._lang[singular] || singular)
      : singular
    );

    if (typeof res === "object") {
      res = res[gt._plural(count) + 1] || res[1] || singular;
    }

    if (args !== null && typeof args === "object") {
      res = res.replace(gt._formatRE, function(z, key) {
        return (key in args ? args[key] : "");
      });
    }

    return res;
  };

  gt.load = function(newLang) {
    var src = [];

    gt._lang = newLang;
    if ("" in newLang && "plural-forms" in newLang[""]) {
      src = newLang[""]["plural-forms"].match(gt._pluralRE);
      gt._nplurals = src[1];
      gt._plural = new Function("n", "return +(" + src[2] + ")");
    }
  };

  if (
      typeof module === "object"
      && module
      && typeof module.exports === "object"
  ) {
    module.exports = gt;
  } else {
    window.gettext = (window.__ = gt);
    window.ngettext = (window.n_ = gt.ngettext);
  }
})(this);
