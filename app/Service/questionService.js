var questionModel = require("../Model/question");
var mailer = require("../Middleware/mailer");
//Ask Question
exports.askQuestion = (data, id) => {
  return new Promise((resolve, reject) => {
    var details = {
      title: data.title,
      question: data.question,
      userId: id
    };
    questionModel
      .create(details)
      .then(created => {
        if (created) {
          resolve({
            success: true,
            message: "Question asked sucessfully !!!",
            data: created
          });
        } else {
          resolve({ success: false, message: "Question was not asked !!!" });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

//View Questions
exports.getAllQuestions = (pagenumber = 1, pagesize = 20) => {
  return new Promise((resolve, reject) => {
    questionModel
      .find({})
      .skip(parseInt(pagenumber - 1) * parseInt(pagesize))
      .limit(parseInt(pagesize))
      .populate({ path: "userId", model: "auth", select: { _id: 0, __v: 0 } })
      .populate({
        path: "answers.userId",
        model: "auth",
        select: { _id: 0, __v: 0, password: 0 }
      })
      .populate({
        path: "upVote.userId",
        model: "auth",
        select: { _id: 0, __v: 0, password: 0 }
      })
      .populate({
        path: "downVote.userId",
        model: "auth",
        select: { _id: 0, __v: 0, password: 0 }
      })
      .populate({
        path: "subscribedUsers",
        model: "auth",
        select: { _id: 0, __v: 0 }
      })
      .exec((err, result) => {
        if (err) reject(err);
        if (result) {
          resolve({ success: true, message: "Question found", data: result });
        } else {
          resolve({ success: false, message: "No question found !!!" });
        }
      });
  });
};

//Answer Question
exports.AnswerQuestion = (questionId, message, userId) => {
  return new Promise((resolve, reject) => {
    var details = {
      userId: userId,
      answer: message,
      timeCreated: new Date()
    };
    questionModel
      .findById({ _id: questionId })
      .then(found => {
        if (found) {
          questionModel
            .findOneAndUpdate(
              { _id: questionId },
              { $push: { answers: details } }
            )
            .then(answered => {
              if (answered) {
                mailSubscribers(questionId, message)
                  .then(got => {
                    if (got) {
                      resolve({
                        success: true,
                        message: "Question was answered ",
                        data: got
                      });
                    } else {
                      resolve({ success: false, message: "Error encountered" });
                    }
                  })
                  .catch(err => {
                    reject(err);
                  });
              } else {
                resolve({
                  success: false,
                  message: "Sorry could not answer question !!!"
                });
              }
            });
        } else {
          resolve({
            success: false,
            message: "Sorry Question no longer Exists !!!"
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

//Upvote question
exports.UpvoteQuestion = (questionId, userId) => {
  return new Promise((resolve, reject) => {
    var data = {
      userId: userId
    };
    questionModel
      .findOne({ _id: questionId, userId: userId })
      .then(exist => {
        if (exist == "" || exist == null || exist.lenght == 0) {
          questionModel
            .findOne({ _id: questionId, "downVote.userId": userId })
            .then(got => {
              if (got == "" || got == null || got.lenght == 0) {
                questionModel
                  .findOne({ _id: questionId, "upVote.userId": userId })
                  .then(found => {
                    if (found == "" || found == null || found.lenght == 0) {
                      questionModel
                        .findOneAndUpdate(
                          { _id: questionId },
                          { $push: { upVote: data } }
                        )
                        .then(voted => {
                          if (voted) {
                            questionModel
                              .update(
                                { _id: questionId },
                                { $inc: { upVoteCount: 1 } }
                              )
                              .then(upvoted => {
                                if (upvoted) {
                                  resolve({
                                    success: true,
                                    message: "Question was Voted "
                                  });
                                } else {
                                  resolve({
                                    success: false,
                                    message:
                                      "Error occured while upvoting question !!!"
                                  });
                                }
                              });
                          } else {
                            resolve({
                              success: false,
                              message: "Sorry could not vote question !!!"
                            });
                          }
                        });
                    } else {
                      resolve({
                        success: false,
                        message: "Sorry you already voted for this question !!!"
                      });
                    }
                  });
              } else {
                questionModel
                  .findOneAndUpdate(
                    { _id: questionId },
                    { $pull: { downVote: { userId: userId } } }
                  )
                  .then(deleted => {
                    if (deleted) {
                      questionModel
                        .update(
                          { _id: questionId },
                          { $inc: { downVoteCount: -1 } }
                        )
                        .then(downvoted => {
                          if (downvoted) {
                            questionModel
                              .findOneAndUpdate(
                                { _id: questionId },
                                { $push: { upVote: data } }
                              )
                              .then(voted => {
                                if (voted) {
                                  questionModel
                                    .update(
                                      { _id: questionId },
                                      { $inc: { upVoteCount: 1 } }
                                    )
                                    .then(upvoted => {
                                      if (upvoted) {
                                        resolve({
                                          success: true,
                                          message: "Question was Voted "
                                        });
                                      } else {
                                        resolve({
                                          success: false,
                                          message:
                                            "Error occured while upvoting question !!!"
                                        });
                                      }
                                    });
                                } else {
                                  resolve({
                                    success: false,
                                    message: "Sorry could not vote question !!!"
                                  });
                                }
                              });
                          } else {
                            resolve({
                              success: false,
                              message: "Error occured during voting process !!!"
                            });
                          }
                        });
                    } else {
                      resolve({
                        success: false,
                        message: "Error occured during voting process !!!"
                      });
                    }
                  });
              }
            });
        } else {
          resolve({
            success: false,
            message: "Sorry you cant vote a question you asked !!!"
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

//down vote question
exports.downVoteQuestion = (questionId, userId) => {
  return new Promise((resolve, reject) => {
    var data = {
      userId: userId
    };
    questionModel
      .findOne({ _id: questionId, userId: userId })
      .then(exist => {
        if (exist == "" || exist == null || exist.lenght == 0) {
          questionModel
            .findOne({ _id: questionId, "upVote.userId": userId })
            .then(got => {
              if (got == "" || got == null || got.lenght == 0) {
                questionModel
                  .findOne({ _id: questionId, "downVote.userId": userId })
                  .then(found => {
                    if (found == "" || found == null || found.lenght == 0) {
                      questionModel
                        .findOneAndUpdate(
                          { _id: questionId },
                          { $push: { downVote: data } }
                        )
                        .then(voted => {
                          if (voted) {
                            questionModel
                              .update(
                                { _id: questionId },
                                { $inc: { downVoteCount: 1 } }
                              )
                              .then(upvoted => {
                                if (upvoted) {
                                  resolve({
                                    success: true,
                                    message: "Question was down voted "
                                  });
                                } else {
                                  resolve({
                                    success: false,
                                    message:
                                      "Error occured while down voting question !!!"
                                  });
                                }
                              });
                          } else {
                            resolve({
                              success: false,
                              message: "Sorry could not down vote question !!!"
                            });
                          }
                        });
                    } else {
                      resolve({
                        success: false,
                        message:
                          "Sorry you already down voted for this question !!!"
                      });
                    }
                  });
              } else {
                questionModel
                  .findOneAndUpdate(
                    { _id: questionId },
                    { $pull: { upVote: { userId: userId } } }
                  )
                  .then(deleted => {
                    if (deleted) {
                      questionModel
                        .update(
                          { _id: questionId },
                          { $inc: { upVoteCount: -1 } }
                        )
                        .then(downvoted => {
                          if (downvoted) {
                            questionModel
                              .findOneAndUpdate(
                                { _id: questionId },
                                { $push: { downVote: data } }
                              )
                              .then(voted => {
                                if (voted) {
                                  questionModel
                                    .update(
                                      { _id: questionId },
                                      { $inc: { downVoteCount: 1 } }
                                    )
                                    .then(upvoted => {
                                      if (upvoted) {
                                        resolve({
                                          success: true,
                                          message: "Question was down Voted "
                                        });
                                      } else {
                                        resolve({
                                          success: false,
                                          message:
                                            "Error occured while upvoting question !!!"
                                        });
                                      }
                                    });
                                } else {
                                  resolve({
                                    success: false,
                                    message: "Sorry could not vote question !!!"
                                  });
                                }
                              });
                          } else {
                            resolve({
                              success: false,
                              message: "Error occured during voting process !!!"
                            });
                          }
                        });
                    } else {
                      resolve({
                        success: false,
                        message: "Error occured during voting process !!!"
                      });
                    }
                  });
              }
            });
        } else {
          resolve({
            success: false,
            message: "Sorry you cant vote a question you asked !!!"
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

//Search via title , question and answers
exports.Search = option => {
  return new Promise((resolve, reject) => {
    questionModel
      .find({
        $or: [
          { title: { $regex: option, $options: "i" } },
          { question: { $regex: option, $options: "i" } },
          { "answers.answer": { $regex: option, $options: "i" } }
        ]
      })
      .exec((err, found) => {
        if (err) {
          reject(err);
        }
        if (found == null || Object.keys(found).length === 0) {
          resolve({
            success: false,
            data: {},
            message: "We could not find what you are looking for."
          });
        } else {
          resolve({ success: true, data: found, message: "" });
        }
      });
  });
};

//subscribe to question
exports.subscribeToQuestion = (id, questionId) => {
  return new Promise((resolve, reject) => {
    questionModel
      .findOne({ subscribedUsers: id })
      .then(found => {
        if (found) {
          resolve({
            success: false,
            message: "Sorry seems you already subscribed to this question "
          });
        } else {
          questionModel
            .findOneAndUpdate(
              { _id: questionId },
              { $push: { subscribedUsers: id } }
            )
            .then(subscribed => {
              if (subscribed) {
                resolve({
                  success: true,
                  message: "you subscribed to this question successfully !!"
                });
              } else {
                resolve({
                  success: false,
                  message: "Error encountered while subscribing to question !!"
                });
              }
            });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

//Sends mail to subscriber of a question
function mailSubscribers(questionId, answer) {
  return new Promise((resolve, reject) => {
    questionModel
      .findOne(
        { _id: questionId },
        {
          question: 0,
          userId: 0,
          upVote: 0,
          upVoteCount: 0,
          downVote: 0,
          downVoteCount: 0
        }
      )
      .populate({
        path: "subscribedUsers",
        model: "auth",
        select: { _id: 0, __v: 0 }
      })
      .exec((err, result) => {
        if (err) reject(err);
        if (result) {
          var questionTitle = result.title;
          var subscribers = result.subscribedUsers;
          var mail = subscribers.map(e => e.email);
          var singleMail = mail.toString();
          mailer
            .mailIUser(singleMail, answer, questionTitle)
            .then(sent => {
              if (sent) {
                resolve({ success: true, message: sent });
              } else {
                resolve({ success: false, message: "Error Sending mail" });
              }
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve({ success: false, message: "nothing found" });
        }
      });
  });
}


exports.deleteQuestion = (userId, questionId)=>{
  return new Promise((resolve , reject)=>{
    questionModel.findOneAndRemove({_id:questionId , userId:userId}).then(deleted =>{
      if(deleted){
        resolve({success:true , message:'Question deleted successfully !!!'})
      }else{
        resolve({success:false , message:'Error encountered while deleting question !!!'})
      }
    }).catch(err =>{
      reject(err);
    })
  })
}