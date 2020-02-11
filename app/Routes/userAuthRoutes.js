var authController = require('../Controller/authController');
var router = require('express').Router();
module.exports = function(){
    const authCtrl = new authController();
    router.post('/register', authCtrl.register);
    router.post('/authenticate', authCtrl.login);
    router.get('/search', authCtrl.search);
    return router;
}