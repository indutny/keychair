BROWSERIFY ?= ./node_modules/.bin/browserify

public/js/bundle.js: public/src/app.js lib/*.js lib/**/*.js lib/**/**/*.js
	$(BROWSERIFY) public/src/app.js -o public/js/bundle.js
