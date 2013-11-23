'use strict';


module.exports = function (server) {

    server.get('/', function (req, res) {
        var model = { name: 'kraken-example-custom-middleware' };
        
        res.render('index', model);
        
    });

};
