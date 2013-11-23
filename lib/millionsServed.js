/**
 * Created with IntelliJ IDEA.
 * User: lmarkus
 * Date: 11/22/13
 * A very simple page counter middleware
 */

'use strict';

module.exports = function () {
    var requestsServed = 0;

    return function (req, res, next) {
        requestsServed += 1;
        console.log(requestsServed / 1000000 + ' Million Pages Served!');
        next();
    };
};
