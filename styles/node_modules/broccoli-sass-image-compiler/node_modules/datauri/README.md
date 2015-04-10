datauri [![Build Status](https://secure.travis-ci.org/heldr/datauri.png?branch=master)](http://travis-ci.org/heldr/datauri) [![Coverage Status](https://coveralls.io/repos/heldr/datauri/badge.png)](https://coveralls.io/r/heldr/datauri) [![NPM version](https://badge.fury.io/js/datauri.png)](http://badge.fury.io/js/datauri)
=======

A simple [Data URI scheme][datauri] generator built on top of [Node.js][nodejs]. To install datauri, just run:

`npm install -g datauri` (it may require Root privileges)


CLIENT
------

### Print datauri scheme
To print a data-uri scheme from a file
```CLI
$ datauri brand.png
```

### CSS Background
You can generate or update an output css file with data-uri background:
```CLI
$ datauri brand.png asset/background.css
```
If you want to define a Class Name, just type:
```CLI
$ datauri brand.png asset/background.css MyNewClass
```

API
---

### Function
```js
var Datauri = require('datauri'),
    dUri    = Datauri('test/myfile.png');

console.log(dUri); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

### Class
```js
var Datauri = require('datauri'),
    dUri    = new Datauri('test/myfile.png');

console.log(dUri.content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
console.log(dUri.mimetype); //=> "image/png"
console.log(dUri.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
console.log(dUri.getCSS()); //=> "\n.case {\n    background: url('data:image/png;base64,iVBORw..."
console.log(dUri.getCSS("myClass")); //=> "\n.myClass {\n    background: url('data:image/png;base64,iVBORw..."
```

### Async

```js
var Datauri = require('datauri'),
    dUri    = new Datauri();

dUri.on('encoded', function (content) {
    console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
});

dUri.on('error', function (content) {
    console.log('Fail!');
});

dUri.encode('test/myfile.png');
```

#### Chaining all stuff
```js
dUri.on('encoded', function (content) {

        console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

        console.log(this.mimetype); //=> "image/png"
        console.log(this.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
        console.log(this.getCSS()); //=> "\n.case {\n    background: url('data:image/png;base64,iVBORw..."
        console.log(this.getCSS("myClass")); //=> "\n.myClass {\n    background: url('data:image/png;base64,iVBORw..."
    })
    .on('error', function (content) {
        console.log('Fail!');
    })
    .encode('test/myfile.png');
```

### Function callback
```js
var DataURI = require('datauri');

DataURI('test/myfile.png', function (err, content) {
    if (err) {
        throw err;
    }

    console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

    console.log(this.mimetype); //=> "image/png"
    console.log(this.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
    console.log(this.getCSS()); //=> "\n.case {\n    background: url('data:image/png;base64,iVBORw..."
    console.log(this.getCSS("myClass")); //=> "\n.myClass {\n    background: url('data:image/png;base64,iVBORw..."
});

```

### Promises [/A+ standard][promisesaplus]
```js
var DataURI = require('datauri').promises;

DataURI('test/myfile.png').then(function (content) {
    console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
},
function (err) {
    throw err;
});

```

### Create from a string
```js
var Datauri = require('datauri'),
    dUri    = new Datauri();

dUri.format('.png', 'xkcd');

console.log(dUri.content); //=> "data:image/png;base64,eGtjZA=="
console.log(dUri.mimetype); //=> "image/png"
console.log(dUri.base64); //=> "eGtjZA=="
console.log(dUri.getCSS("myClassName")); //=> "\n.myClassName {\n    background: url('data:image/png;base64,eGtjZA==..."

```

GRUNT
-----

There are a bunch of grunt plugins running on top of datauri module.

* [grunt-datauri](https://npmjs.org/package/grunt-datauri) - Create base64 encoded data-uris for css from images
* [grunt-imweb](https://npmjs.org/package/grunt-imweb) - IMWEB Tasks Collection For Daily Workflow.
* [grunt-static-inline](https://npmjs.org/package/grunt-static-inline) - A grunt plugin to replace url from static files such as img,js,css an put inline in a template.
* [grunt-data-uri](https://npmjs.org/package/grunt-data-uri) - Convert to data-uri from image path.
* [grunt-inline](https://npmjs.org/package/grunt-inline)

DEVELOPING
----------

The only essential library to develop datauri is jshint.

```CLI
$ make install
$ make test
```

If you'd like to test the full process including npm installer, just run:

```CLI
$ make fulltest
```

## Release notes

* 0.5 - Format data uri from a string
* 0.4 - Promises support
* 0.3 - API Rewritten from the top to the bottom + full async compatibility
* 0.2 - Splitted in submodules mimer and templayed
* 0.1 - First release

## License

MIT License
(c) [Helder Santana](http://heldr.com)

[nodejs]: http://nodejs.org/download
[datauri]: http://en.wikipedia.org/wiki/Data_URI_scheme
[promisesaplus]: http://promises-aplus.github.io/promises-spec/
