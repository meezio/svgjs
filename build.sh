#!/bin/sh

# sudo npm install -g uglify-js

NAME=svg

mkdir -p build

cat \
  src/event.js \
  src/svg.js \
  src/select.js \
  src/edit.js \
> build/${NAME}.js

DIR=$(pwd)
cd build

uglifyjs --source-map ${NAME}.min.js.map -o ${NAME}.min.js ${NAME}.js

cd $DIR


