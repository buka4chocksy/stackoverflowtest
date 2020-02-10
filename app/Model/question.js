var mongoose = require('mongoose');
var schema =  mongoose.Schema;
var questionSchema = new schema({
    title:{type:String , required:true},
    question:{type:String , required:true},
    answers: [{
        userId: { type: mongoose.Types.ObjectId, ref: 'auth', autopopulate: true },
        answer:{ type:String},
        timeCreated:{type:Date}
    }],
    userId: { type: mongoose.Types.ObjectId, ref: 'auth', autopopulate: true },
    upVote:[{ type: mongoose.Types.ObjectId, ref: 'auth', autopopulate: true }],
    downVote:[{ type: mongoose.Types.ObjectId, ref: 'auth', autopopulate: true }],
    subscribedUsers:[{ type: mongoose.Types.ObjectId, ref: 'auth', autopopulate: true }],
    timeCreated:{type:Date}

})

module.exports = mongoose.model('question' , questionSchema);