/*! gettext-pythonic v1.0.0
 * <https://github.com/vphantom/gettext-pythonic>
 * Copyright 2016 Stéphane Lavergne
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

(function(context) {
  var gt;

  gt = function(target, args) {
    // Browser-side needs this redundancy with gt.gettext()
    return gt.ngettext(target, null, null, args);
  };

  gt._formatRE    = /%\{([^}]+)\}/g;
  gt._pluralRE    = /nplurals=(\d+);\s+plural=([^;]+);/;
  gt._npluralsDef = 2;  // Not currently used
  gt._pluralDef   = function(n) {
    return +(Math.abs(n) != 1);  // eslint-disable-line eqeqeq
  };

  gt.ngettext = function(singular, plural, count, args) {
    // Our target is singular or its translation (possibly an array)
    var res = (
      gt._lang !== null && singular in gt._lang
      ? (gt._lang[singular] || singular)
      : singular
    );

    // Plural: choose right form from array or plural argument
    if (typeof res === "object") {
      res = res[gt._plural(count) + 1] || res[1] || singular;
    } else if (typeof plural === "string" && gt._plural(count)) {
      res = plural;
    }

    // Pythonic substitutions
    if (args !== null && typeof args === "object") {
      res = res.replace(gt._formatRE, function(z, key) {
        return (key in args ? args[key] : "");
      });
    }

    return res;
  };

  gt.gettext = function(target, args) {
    return gt.ngettext(target, null, null, args);
  };

  gt.load = function(newLang) {
    var src = [];

    gt._lang = (typeof newLang === "object" ? newLang : {});

    try {
      src = gt._lang[""]["plural-forms"].match(gt._pluralRE);
      gt._nplurals = src[1];
      gt._plural = new Function(
        "n",
        "n = Math.abs(n); return +(" + src[2] + ")"
      );
    } catch (e) {
      gt._nplurals = gt._npluralsDef;
      gt._plural = gt._pluralDef;
    }
  };
  gt.load();  // Initialize implicitly

  if (typeof context.exports === "object") {
    context.exports = gt;
  } else {
    // Browser-side, gettext is global so it needs to be gt, not gt.gettext
    context.gettext = (context.__ = gt);
    context.ngettext = (context.n_ = gt.ngettext);
  }
})(module || this);
