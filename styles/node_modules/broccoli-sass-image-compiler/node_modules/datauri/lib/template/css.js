/*
 * datauri - A simple Data URI scheme generator
 * https://github.com/heldr/datauri
 *
 * Copyright (c) 2014 Helder Santana
 * Licensed under the MIT license.
 * https://raw.github.com/heldr/datauri/master/MIT-LICENSE.txt
 */

module.exports = function () {
    'use strict';

    var util       = require('util'),
        className  = util.format('.%s {', this.className.replace(/\s+/gi, '_')),
        background = util.format("    background: url('%s');", this.background);

    return [
        "",
        className,
        background,
        "}"
    ].join('\n');
};
