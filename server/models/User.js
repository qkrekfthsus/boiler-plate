const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1 
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function(next){
    //비밀번호를 암호화 시킴
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();

            });
        });
    }
    else{
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 암호화된 비밀번호 비교
    //해쉬화된 비밀번호 복호화 X
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    });
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //jsonwebtoken을 이용하여 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user)
    });
};

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    //토큰 복호화
    jwt.verify(token, "secretToken", function(err, decoded){
        //유저 아이디 decoded
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    });
};

const User = mongoose.model('User', userSchema);
module.exports = {User};