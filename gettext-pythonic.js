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
  var gettext;

  if (window._) {
    return;
  }

  gettext = function(target, args) {
    var res = (
      gettext._lang !== null && target in gettext._lang
      ? (gettext._lang[target] || target)
      : target
    );

    if (args !== null && typeof args === "object") {
      res = res.replace(gettext._formatRE, function(z, key) {
        return args[key];
      });
    }

    return res;
  };

  gettext._formatRE = /\{([^}]+)\}/g;

  gettext._lang = null;
  gettext.load = function(newLang) {
    gettext._lang = newLang;
  };

  if (
      typeof module === "object"
      && module
      && typeof module.exports === "object"
  ) {
    module.exports = gettext;
  } else {
    window._ = gettext;
  }
})(this);
