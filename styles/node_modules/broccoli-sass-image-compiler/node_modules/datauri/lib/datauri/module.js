/*
 * datauri - A simple Data URI scheme generator
 * https://github.com/heldr/datauri
 *
 * Copyright (c) 2014 Helder Santana
 * Licensed under the MIT license.
 * https://raw.github.com/heldr/datauri/master/MIT-LICENSE.txt
 */

"use strict";

var mixin        = require('../helper').mixin,
    RSVP         = require('rsvp'),
    Api          = require('./api'),
    EventEmitter = require('events').EventEmitter;

function DataURI(fileName, handler) {
    var datauri = null;

    EventEmitter.call(this);

    if (!(this instanceof DataURI)) {
        datauri = new DataURI();

        if (handler && typeof handler === 'function') {
            datauri.encode(fileName, handler);

            return;
        }

        return (fileName) ? datauri.encodeSync(fileName) : datauri;
    }

    if (fileName) {
        return this.encodeSync(fileName);
    }

    return this;
}

function promises(fileName) {
    var datauri = module.exports.prototype.constructor(),
        promise = new RSVP.Promise(function (resolve, reject) {
            datauri.on('encoded', resolve)
                .on('error', reject)
                .encode(fileName);
        });

    return promise;
}

Object.defineProperty(DataURI, 'promises', {
    value: promises,
    writable: false
});

mixin(DataURI.prototype, EventEmitter.prototype);
mixin(DataURI.prototype, Api);

module.exports = DataURI;
