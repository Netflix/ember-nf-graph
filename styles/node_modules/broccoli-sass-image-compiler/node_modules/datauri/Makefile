SHELL    = /bin/sh
NPM      = npm
NODE     = node
MODULE   = ./node_modules/.bin/
MOCHA    = $(MODULE)mocha --recursive --ui bdd --timeout 3000
COVERAGE = $(MOCHA) --require blanket
LCOV     = $(COVERAGE) --reporter mocha-lcov-reporter

install:
	$(NPM) install
clean:
	rm -rf node_modules
lint:
	$(MODULE)jshint datauri.js lib/* --config .jshintrc
spec:
	$(MOCHA) --reporter spec
dot:
	$(MOCHA) --reporter dot
coverage-html:
	$(COVERAGE) --reporter html-cov > test/coverage/results.html
coverage-lcov:
	$(LCOV) > test/coverage/results.lcov
coveralls:
	$(LCOV) | ./node_modules/coveralls/bin/coveralls.js
test_editor: lint dot
fulltest: clean install test
test: lint dot
ci: test coveralls
