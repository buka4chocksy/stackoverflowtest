var questionController = require('../Controller/questionController');
var middleWare = require('../Middleware/authMiddleware');
var router = require('express').Router();
module.exports = function(){
    const questionCtrl = new questionController();
    router.post('/ask', middleWare.authenticate ,  questionCtrl.askQuestion);
    router.get('/:pagesize/:pagenumber', middleWare.authenticate ,  questionCtrl.getAllQuestions);
    router.get('/search',  questionCtrl.search);
    router.post('/:id', middleWare.authenticate ,  questionCtrl.AnswerQuestions);
    router.post('/vote/:id', middleWare.authenticate ,  questionCtrl.voteQuestion);
    router.post('/downvote/:id', middleWare.authenticate ,  questionCtrl.downVoteQuestion);
    router.post('/subscribe/:id', middleWare.authenticate ,  questionCtrl.subscribeToQuestion);

    return router;
}