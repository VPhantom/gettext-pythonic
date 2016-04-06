var test = require("tape");

var __ = require("./gettext-pythonic.js");

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
    __("Hi, %{one} this is %{three} or %{two}...", args),
    "Hi, first this is third or second...",
    ""
  );

  t.end();
});
