var AuthRoutes = require('./userAuthRoutes');

module.exports = function(router){
    router.use('/auth',AuthRoutes())

 return router;
}