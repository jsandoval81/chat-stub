'use strict';

var home = require('../controllers/home-controller');

module.exports.initialize = function (app) {
	//===============
    //== Home Page ==
    //===============
    app.get('/', home.index);

};