/*
 * datauri - A simple Data URI scheme generator
 * https://github.com/heldr/datauri
 *
 * Copyright (c) 2014 Helder Santana
 * Licensed under the MIT license.
 * https://raw.github.com/heldr/datauri/master/MIT-LICENSE.txt
 */

"use strict";

var path       = require('path'),
    fs         = require('fs'),
    mimer      = require('mimer'),
    uri        = require('../template/uri'),
    css        = require('../template/css'),
    existsSync = fs.existsSync,
    exists     = fs.exists;

module.exports = {
    format: function (fileName, fileContent) {
        fileContent   = (fileContent instanceof Buffer) ? fileContent : new Buffer(fileContent);
        this.fileName = fileName;
        this.base64   = fileContent.toString('base64');
        this.mimetype = mimer(fileName);
        this.content  = uri.call(this);

        return this;
    },

    encode: function (fileName, handler) {
        this.async(fileName, function (err) {
            if (handler) {
                if (err) {
                    return handler(err);
                }

                handler.call(this, null, this.content, this);

                return;
            }

            if (err) {
                this.emit('error', err);

                return;
            }

            this.emit('encoded', this.content, this);
        });
    },

    encodeSync: function (fileName) {
        if (!fileName || !fileName.trim || fileName.trim() === '') {
            throw new Error('Insert a File path as string argument');
        }

        if (existsSync(fileName)) {
            var fileContent = fs.readFileSync(fileName);

            return this.format(fileName, fileContent).content;
        } else {
            throw new Error('The file ' + fileName + ' was not found!');
        }

    },

    async: function (fileName, handler) {
        var self = this;

        exists(fileName, function () {
            fs.readFile(fileName, function (err, fileContent) {
                if (err) {
                    return handler.call(self, err);
                }

                handler.call(self.format(fileName, fileContent));
            });
        });
    },

    getCss: function (className) {

        if (!this.content) {
            throw new Error('Create a data-uri config using the method encodeSync');
        }

        className = className || path.basename(this.fileName, path.extname(this.fileName));

        return css.call({
            className: className,
            background: this.content
        });
    }
};
