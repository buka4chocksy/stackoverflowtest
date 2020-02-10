var AuthRoutes = require('./userAuthRoutes');
var questionRoutes = require('./questionRoutes')
module.exports = function(router){
    router.use('/auth',AuthRoutes())
    router.use('/question', questionRoutes())

 return router;
}