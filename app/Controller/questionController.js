var questionService = require('../Service/questionService');

module.exports = function questionController(){
    this.askQuestion = (req,res , next)=>{
        questionService.askQuestion(req.body , req.auth.Id).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json(err);
        })
    }

    this.getAllQuestions =(req,res)=>{
        questionService.getAllQuestions(req.params.pagenumber , req.params.pagesize )
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }

    this.AnswerQuestions =(req,res)=>{
        questionService.AnswerQuestion(req.params.id , req.body.message , req.auth.Id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }

    this.voteQuestion =(req,res)=>{
        questionService.UpvoteQuestion(req.params.id , req.auth.Id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }

    this.downVoteQuestion =(req,res)=>{
        questionService.downVoteQuestion(req.params.id , req.auth.Id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }
    this.search =(req,res)=>{
        var option = req.body.search;
        questionService.Search(option)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }

    this.subscribeToQuestion =(req,res)=>{
        questionService.subscribeToQuestion(req.auth.Id,req.params.id )
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }

    this.deleteQuestion = (req,res)=>{
        questionService.deleteQuestion(req.auth.Id , req.params.id)
        .then(data => res.status(200).send(data))
        .catch(err =>res.status(500).send(err));
    }
}
