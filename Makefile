JS      = uglifyjs --compress --mangle --reserved window "--comments=/Free software under/"

help:
	@echo "Try one of: clean, all"

clean:
	rm -f *.min.js

all:	gettext-pythonic.min.js

%.min.js:	%.js
	$(JS) -o $@ -- $<

.PHONY: help all clean
