all: clean build

build:
	mkdir -p dist
	NODE_ENV=production npm run build

watch:
	npm run watch

dist:
	NODE_ENV=production npm run build

dist-test:
	NODE_ENV=production npm run build-test

tiny:
	NODE_ENV=production node_modules/.bin/uglifyjs --screw-ie8 --mangle --compress warnings,collapse_vars,drop_debugger,join_vars,sequences,properties,unused,dead_code,conditionals,comparisons,evaluate,booleans,loops,if_return dist/build.js > dist/build.min.js

serve:
	npm run serve

clean:
	npm run clean

test:
	npm test

.PHONY: build watch serve clean test dist
