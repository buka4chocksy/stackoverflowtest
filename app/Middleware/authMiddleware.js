var authService = require('../Service/authService');
var User = require('../Model/auth');

exports.authenticate = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        authService.verifyToken(token).then(decoded => {
            User.findOne({ publicId: decoded.publicId }, '').then(data => {
                if (data == null) {
                    res.status(401).send({ success: false, message: "User does not exist" });
                } else {
                    req.auth = {
                        publicId: data.publicId,
                        email: decoded.email,
                        userName: data.userName,
                        Id: data._id
                    }
                    res.locals.response = { data: decoded, message: "", success: true };
                    next();
                }
            })
        }).catch(err => {
            res.status(401).send({ success: false, message: "Invalid token", data: err });

        })
    } else {
        res.status(401).send({ success: false, message: "Please login to complete this process" });
    }
}
