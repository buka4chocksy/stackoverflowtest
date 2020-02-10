var questionModel =  require('../Model/question');

exports.askQuestion = (data , id)=>{
    return new Promise((resolve , reject)=>{
        var details = {
            title:data.title,
            question:data.question,
            userId:id
        }
        questionModel.create(details).then(created =>{
            if(created){
                resolve({success:true , message:'Question asked sucessfully !!!' , data:created});
            }else{
                resolve({success:false ,  message:'Question was not asked !!!'});
            }
        }).catch(err =>{
            reject(err);
        })
    })
}

exports.getAllQuestions = (pagenumber = 1 , pagesize = 20)=>{
    return new Promise((resolve , reject)=>{
        questionModel.find({}).skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
        .populate({path: "userId" , model:'auth' , select: { _id: 0, __v: 0 }})
        .populate({path: "answers.userId" , model:'auth' , select: { _id: 0, __v: 0  , password: 0 , }})
        .populate({path: "upVote" , model:'auth' , select: { _id: 0, __v: 0 }})
        .populate({path: "downVote" , model:'auth' , select: { _id: 0, __v: 0 }})
        .populate({path: "subscribedUsers" , model:'auth' , select: { _id: 0, __v: 0 }})
        .exec((err , result)=>{
            if (err) reject(err);
            if(result){
                resolve({success:true , message: 'Question found' , data:result})
            }else{
                resolve({success:false , message:'No question found !!!'})
            }
        })
    })
}

exports.AnswerQuestion = (questionId , message , userId)=>{
    return new Promise((resolve , reject)=>{
        var details = {
            userId:userId,
            answer:message,
            timeCreated:new Date()
        }
        questionModel.findById({_id:questionId}).then(found =>{
            if(found){
                questionModel.findOneAndUpdate({_id:questionId}, {$push :{answers:details}}).then(answered =>{
                    if(answered){
                        resolve({success: true , message:'Question was answered '})
                    }else{
                        resolve({success: false , message:'Sorry could not answer question !!!'})
                    }
                })
            }else{
                resolve({success:false , message:'Sorry Question no longer Exists !!!'})
            }
        }).catch(err =>{
            reject(err);
        })
    })
}

