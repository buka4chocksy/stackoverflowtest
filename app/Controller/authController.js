var service = require('../Service/authService');

 module.exports = function authController(){
    this.register = (req, res , next)=>{
        service.userSignUp(req.body).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json(err);
        })
    }

    this.login = (req, res)=>{
        service.login(req.body).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json(err);
        })
    }

    this.search =(req,res)=>{
        var option = req.body.search;
        service.Search(option)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }
}