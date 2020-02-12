var chai = require('chai');
var {expect} = chai
var app = require('../../server');
var faker = require('faker')
var chaiHttp = require('chai-http')
chai.use(chaiHttp);
//user test
var token;
var signup = "/api/auth/register";
var login = "/api/auth/authenticate";
var signUpDetail =  {email: faker.internet.email() , password: faker.internet.password() , userName: faker.internet.userName}
var loginDetail =  {email: 'buka4chocksy@gmail.com' , password: '123456'}

//signUp user
describe('signup', ()=>{
    it('should create new user' , (done)=>{
        chai.request(app)
        .post(signup)
        .send(signUpDetail)
        .end((err , res)=>{
            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            done();
        })
    })
})

//login user
describe('login',()=>{
    it('should authenticate user', (done)=>{
        chai.request(app)
        .post(login)
        .send(loginDetail)
        .end((err, res)=>{
            expect(res.status).to.equal(200);
            token = res.body.data.token
            done()
        })
    })
})

//Question
var askQuestion = '/api/question/ask';
var getAllQuestions = '/api/question/2/1';
var upVote = '/api/question/vote/5e445d2235bbb41d3cc8395d';
var downVote = '/api/question/downvote/5e445d2235bbb41d3cc8395d';
var subscribe = '/api/question/subscribe/5e445d2235bbb41d3cc8395d';
var QuestionDetails = {title:'something' , question:'hello i am here to anser you', userId:'5e415a7734fae12cbc16deb3'}
//Ask Question
describe('ask question', ()=>{
    it('should be able to post question ', (done)=>{
        chai.request(app)
        .post(askQuestion)
        .set("x-access-token",token)
        .send(QuestionDetails)
        .end((err ,res)=>{
            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty;
            done();
        })
        
    })
})

//Get all Questions
describe('Get all questions',()=>{
    it('should return all questions',(done)=>{
        chai.request(app)
        .get(getAllQuestions)
        .set('x-access-token',token)
        .send('')
        .end((err , res)=>{
            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty;
            done(); 
        })
    })
})

//upvote question
describe('upvote a question', ()=>{
    it('should return Question was Voted',(done)=>{
        chai.request(app)
        .post(upVote)
        .set('x-access-token',token)
        .send('')
        .end((err , res)=>{
            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty;
            done(); 
        })
    })
})

//downvote question
describe('downvote a question', ()=>{
    it('should return Question was downVoted',(done)=>{
        chai.request(app)
        .post(downVote)
        .set('x-access-token',token)
        .send('')
        .end((err , res)=>{
            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty;
            done(); 
        })
    })
})

//subscribe to question
describe('subscribe a question', ()=>{
    it('should return subscription to question successfull ',(done)=>{
        chai.request(app)
        .post(subscribe)
        .set('x-access-token',token)
        .send('')
        .end((err , res)=>{
            expect(res.status).to.equal(200)
            expect(res.body).not.to.be.empty;
            done(); 
        })
    })
})



