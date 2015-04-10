# Broccoli Export Tree

[![Build Status](https://travis-ci.org/rjackson/broccoli-export-tree.svg?branch=master)](https://travis-ci.org/rjackson/broccoli-export-tree)

Export a tree to an external directory.

## Usage

Export a tree to the `dist/` directory:

```javascript
var exportTree = require('broccoli-export-tree');

// assuming someTree is a built up tree
var tree = exportTree(someTree, {
  destDir: 'dist'
});
```

## Documentation

### `exportTree(inputTree, options)`

---

`options.destDir` *{String}*

The path to move the export to.

---

`options.clobber` *{true,false}*

Should the destination directory be removed before copying?

Default: *true*

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm install
npm test
```

## License

This project is distributed under the MIT license.
