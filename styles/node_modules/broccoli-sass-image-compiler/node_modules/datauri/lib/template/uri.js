/*
 * datauri - A simple Data URI scheme generator
 * https://github.com/heldr/datauri
 *
 * Copyright (c) 2014 Helder Santana
 * Licensed under the MIT license.
 * https://raw.github.com/heldr/datauri/master/MIT-LICENSE.txt
 */

module.exports = function () {
    "use strict";

    return [
        "data:",
        this.mimetype,
        ';base64,',
        this.base64
    ].join('');
};
