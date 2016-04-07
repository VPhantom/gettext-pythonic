var test = require("tape");

var gettext = require("./gettext-pythonic.js");
var __ = gettext.gettext;
var n_ = gettext.ngettext;

test("Missing key returns itself", function(t) {
  t.equal(__("foobar"), "foobar");

  t.end();
});

test("Skip substitution without arguments", function(t) {
  t.equal(
    __("...%{1}..."),
    "...%{1}...",
    "numbered"
  );

  t.equal(
    __("...%{foo}..."),
    "...%{foo}...",
    "named"
  );

  t.end();
});

test("Substitution syntax", function(t) {
  t.equal(
    __("...%{}...", {}),
    "...%{}...",
    "avoid empty substitution on object"
  );

  t.equal(
    __("...%{}...", []),
    "...%{}...",
    "avoid empty substitution on array"
  );

  t.end();
});

test("Numbered pythonic variable substitution", function(t) {
  var args = ["first", "second", "third"];

  t.equal(
    __("...%{80}...", args),
    "......",
    "graceful with huge index"
  );

  t.equal(
    __("...%{-5}...", args),
    "......",
    "graceful with negative index"
  );

  t.equal(
    __("%{1}...", args),
    "second...",
    "first in key"
  );

  t.equal(
    __("...%{0}", args),
    "...first",
    "last in key"
  );

  t.equal(
    __("Hi, %{0} this is %{2}.", args),
    "Hi, first this is third.",
    "same order"
  );

  t.equal(
    __("Hi, %{1} this is %{0}.", args),
    "Hi, second this is first.",
    "mixed order"
  );

  t.end();
});

test("Named pythonic variable substitution", function(t) {
  var args = {
    one  : "first",
    two  : "second",
    three: "third"
  };

  t.equal(
    __("...%{foo}...", args),
    "......",
    "graceful with unknown name"
  );

  t.equal(
    __("...%{foo...", args),
    "...%{foo...",
    "graceful with missing closing brace"
  );

  t.equal(
    __("...%{weird key+name_also-very.long[indeed]=etc}...", args),
    "......",
    "graceful with special characters in valid brace"
  );

  t.equal(
    __("Hi, %{one} this is %{three} or %{two}...", args),
    "Hi, first this is third or second...",
    "performs substitution"
  );

  t.end();
});

test("Load a language", function(t) {
  var lang = {
    "This is a test"       : [null, "Ceci est un test"],
    "This isn't translated": [null, ""],
    "This is null"         : null,
    "This is empty"        : [],
    "This is incomplete"   : [null],
    "This is convenient"   : "Ceci est pratique"
  };

  gettext.load("invalid language data");

  t.equal(
    __("foobar", {a: 1}),
    "foobar",
    "unaffected by loading a string instead of a PO object"
  );

  gettext.load(lang);

  t.deepEqual(gettext._lang, lang, "loaded to _lang property");

  t.equal(
    __("This is a test"),
    "Ceci est un test",
    "look up key in language"
  );

  t.equal(
    gettext("This is a test"),
    "Ceci est un test",
    "look up key in language using root object function shortcut"
  );

  t.equal(
    __("Non-existent string"),
    "Non-existent string",
    "unknown key in language stays the same"
  );

  t.equal(
    __("This isn't translated"),
    "This isn't translated",
    "key exists but not translated, outputs key"
  );

  t.equal(
    __("This is null"),
    "This is null",
    "key exists but contains null, outputs key"
  );

  t.equal(
    __("This is empty"),
    "This is empty",
    "key exists but contains empty array, outputs key"
  );

  t.equal(
    __("This is incomplete"),
    "This is incomplete",
    "key exists but contains single-element array, outputs key"
  );

  t.equal(
    __("This is convenient"),
    "Ceci est pratique",
    "key exists and contains basic direct string, outputs string"
  );

  t.end();
});

test("Plural forms", function(t) {
  var fr = {
    "": {
      "plural-forms": "nplurals=2; plural=(n > 1);"
    },
    "%{count} result": [
      "${count} results",
      "%{count} résultat",
      "%{count} résultats"
    ]
  };

  t.equal(
    n_("%{count} result", "%{count} results", 0, {count: 0}),
    "0 results",
    "Default with 0"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 1, {count: 1}),
    "1 result",
    "Default with 1"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 23, {count: 23}),
    "23 results",
    "Default with 23"
  );

  t.equal(
    n_("%{count} result", "%{count} results", -1, {count: -1}),
    "-1 result",
    "Default with -1"
  );

  t.equal(
    n_("%{count} result", "%{count} results", -23, {count: -23}),
    "-23 results",
    "Default with -23"
  );

  gettext.load(fr);

  t.equal(
    n_("%{count} result", "%{count} results", 0, {count: 0}),
    "0 résultat",
    "French with 0"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 1, {count: 1}),
    "1 résultat",
    "French with 1"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 23, {count: 23}),
    "23 résultats",
    "French with 23"
  );

  t.equal(
    n_("%{count} result", "%{count} results", -1, {count: -1}),
    "-1 résultat",
    "French with -1"
  );

  t.equal(
    n_("%{count} result", "%{count} results", -23, {count: -23}),
    "-23 résultats",
    "French with -23"
  );

  gettext.load(23);

  t.equal(
    n_("%{count} result", "%{count} results", 0, {count: 0}),
    "0 results",
    "Default with 0 after French then invalid language"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 1, {count: 1}),
    "1 result",
    "Default with 1 after French then invalid language"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 23, {count: 23}),
    "23 results",
    "Default with 23 after French then invalid language"
  );

  gettext.load(fr);
  gettext.load({});

  t.equal(
    n_("%{count} result", "%{count} results", 0, {count: 0}),
    "0 results",
    "Default with 0 after French then empty object"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 1, {count: 1}),
    "1 result",
    "Default with 1 after French then empty object"
  );

  t.equal(
    n_("%{count} result", "%{count} results", 23, {count: 23}),
    "23 results",
    "Default with 23 after French then empty object"
  );

  t.end();
});

