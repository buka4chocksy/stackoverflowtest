var questionController = require('../Controller/questionController');
var middleWare = require('../Middleware/authMiddleware');
var router = require('express').Router();
module.exports = function(){
    const questionCtrl = new questionController();
    router.post('/ask', middleWare.authenticate ,  questionCtrl.askQuestion);
    router.get('/:pagesize/:pagenumber', middleWare.authenticate ,  questionCtrl.getAllQuestions);
    router.post('/:id', middleWare.authenticate ,  questionCtrl.AnswerQuestions);

    return router;
}