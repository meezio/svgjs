# Meezio SVG core lib

## Build

### Installation

```
sudo npm install -g uglify-js
```

#### Usage

```
./build.sh
```

## Validation du code avec ESLint

### Installation

```bash
sudo npm install -g eslint
sudo npm install -g eslint-config-google
sudo npm install -g eslint-plugin-json --save-dev
```

#### Usage

```
eslint www/js/* --ext json --ext js
```

#### En pré-commit

* ``.git/hooks/pre-commit``

```bash
#!/bin/sh

eslint src/*.js test/js/*.js --ext json --ext js &&
rm -Rf docs/* && jsdoc src/ -c jdoc.json &&
rm -Rf build/* && ./build.sh

if [ $? -ne 0 ]; then
  echo "COMMIT ABORT!"
  exit 1
fi

git add -A .
exit 0
```

## Gestion de la doc

* http://usejsdoc.org/howto-amd-modules.html

1. Installer : ``sudo npm install -g jsdoc``
2. Générer : ``jsdoc README.md www/js/ -d docs/ -r``
