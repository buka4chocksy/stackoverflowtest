var model = require("../Model/auth");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var secret = process.env.secret;
exports.userSignUp = data => {
  return new Promise((resolve, reject) => {
    var password = bcrypt.hashSync(data.password, 10);
    var details = {
      userName: data.userName,
      password: password,
      email: data.email,
      publicId: mongoose.Types.ObjectId(),
      createdAt: new Date()
    };
    model
      .create(details)
      .then(created => {
        if (created) {
          resolve({ success: true, message: "User Signup Successfull !!!" });
        } else {
          resolve({ success: false, message: "Could not Signup User" });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.login = data => {
  return new Promise((resolve, reject) => {
    if (data.email.length == 0 || data.password.length == 0) {
      reject({
        success: false,
        message: "authentication credentials incomplete"
      });
    } else {
      model
        .findOne({ email: data.email })
        .then(found => {
          if (found) {
            var validpassword = bcrypt.compareSync(
              data.password,
              found.password
            );
            if (validpassword) {
              getUserDetail(found, found.publicId).then(userdetail => {
                generateToken(userdetail)
                  .then(token => {
                    resolve({
                      success: true,
                      data: { found, token: token },
                      message: "authentication successful"
                    });
                  })
                  .catch(err => {
                    reject({
                      success: false,
                      data: err,
                      message: "could not authenticate user"
                    });
                  });
              });
            } else {
              reject({
                success: false,
                message: "Incorrect email or password"
              });
            }
          } else {
            reject({ success: false, message: "User does not exist !!" });
          }
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};

function getUserDetail(user, Id) {
  return new Promise((resolve, reject) => {
    model
      .findOne({ publicId: Id }, { _id: 0, __v: 0 })
      .then(data => {
        var specificUserDetail = {
          email: user.email,
          userName: user.userName,
          publicId: user.publicId
        };
        resolve(specificUserDetail);
      })
      .catch(error => reject(error));
  });
}


//Search user  via email , username
exports.Search = (option)=> {
  return new Promise((resolve, reject) => {
    model.find({$or:[{ email: { $regex: option, $options: 'i' } },{ userName: { $regex: option, $options: 'i' } }] } ,{password:0})
          .exec((err, found) => {
              if (err) { reject(err); }
              if (found == null || Object.keys(found).length === 0) {
                  resolve({ success: false, data: {}, message: "We could not find what you are looking for." })
              } else {
                  resolve({ success: true, data: found, message: "" });
              }
          })
  })
}

function generateToken(data = {}) {
  return new Promise((resolve, reject) => {
    jwt.sign({ ...data }, secret, { expiresIn: "24hrs" }, function(err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

exports.generateToken = generateToken;

function verifyToken(token = "") {
  return new Promise((resolve, reject) => {
    jwt.verify(token.replace("Bearer", ""), secret, function(
      err,
      decodedToken
    ) {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
}
exports.verifyToken = verifyToken;
