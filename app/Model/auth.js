var mongoose = require('mongoose')
var schema = mongoose.Schema;
var authSchema =  new schema({
    userName:{type: String , required:true},
    email:{type: String , required:true},
    password:{type: String , required: true },
    publicId:{type:mongoose.SchemaTypes.ObjectId},
    createdAt:{type: Date}
})

module.exports =  mongoose.model('auth' , authSchema);