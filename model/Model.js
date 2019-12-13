const mongoose = require('./db')
const bcrypt = require('bcryptjs')
const UserSchema = mongoose.Schema({
    username:{ 
        type:String ,
        unique:true
        },
    password:{
        type:String,
        set(val){
            return bcrypt.hashSync(val,10)
        }
    }
})

const User = mongoose.model('User',UserSchema,'users')

module.exports =  { User, bcrypt } 