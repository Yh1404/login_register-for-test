const mongoose = require("./db");
const bcrypt = require("bcryptjs"); //散列

const UserSchema = mongoose.Schema({
  //构建Schema映射
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    set(val) {
      return bcrypt.hashSync(val, 10); //对密码进行散列加密后存入数据库
    }
  }
});
const FileSchema = mongoose.Schema({
  filename: {
    type: String,
    unique: true
  },
  size: Number,
  path: {
    type: String,
    unique: true
  }
});

const User = mongoose.model("User", UserSchema, "users"); //利用Schema映射创建model
const File = mongoose.model("File", FileSchema, "documents");
module.exports = { User, bcrypt, File };
