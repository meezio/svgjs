#!/bin/sh

# sudo npm install -g uglify-js

NAME=svg

mkdir -p build
uglifyjs -o build/${NAME}.min.js \
  src/event.js \
  src/svg.js \
  src/select.js \
  src/edit.js
