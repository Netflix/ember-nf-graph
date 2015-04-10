# Broccoli Caching Writer

[![Build Status](https://travis-ci.org/rjackson/broccoli-caching-writer.svg?branch=master)](https://travis-ci.org/rjackson/broccoli-caching-writer)

Adds a thin caching layer based on the computed hash of the input tree. If the input tree has changed,
the `updateCache` method will be called, otherwise (input is the same) the results of the last `updateCache`
call will be used instead.

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm install
npm test
```

## License

This project is distributed under the MIT license.
