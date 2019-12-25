const { User, bcrypt, File } = require("./model/Model");

//const bcrypt = require('bcryptjs') //对密码进行散列加密和验证

const jwt = require("jsonwebtoken"); //生成tokek令牌

const express = require("express");

const app = express();

const SECRET = "gfiuqwhboi9bfnq2rffq"; //token密钥

const cookieParser = require("cookie-parser");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(express.json()); //使用中间件拦截请求
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

// app.all("*", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", " 3.2.1");
//   res.header("Content-Type", "text/html;charset=utf-8");
//   next();
// });

app.post("/api/register", async (req, res) => {
  //注册接口
  try {
    const user = await User.create({
      //创建UserModel实例，此处必须进行await，否则user接收不到创建的实例
      username: req.body.username,
      password: req.body.password
    });
    user.save(); //save（）方法将User写入数据库
    res.send(user); //返回user对象
    console.log("写入成功");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/login", async (req, res) => {
  //获取登录页接口
  try {
    res.status(200);
    res.sendFile(__dirname + "/view/登录页.html");
  } catch (error) {}
});

app.post("/api/login", async (req, res) => {
  //登录接口
  try {
    const user = await User.findOne({
      //根据用户名查找到对应的用户
      username: req.body.username
    });
    if (user) {
      //用户存在，验证密码
      const isVaildPassword = bcrypt.compareSync(req.body.password, user.password); //使用compare方法和数据库中的散列值比对
      if (isVaildPassword) {
        const token = jwt.sign(String(user._id), SECRET); //用密钥和id生成token
        res.cookie("token", String(token), {
          maxAge: 90000000,
          httpOnly: true
        });

        res.status(200);
        res.end();
      } else {
        console.log("用户名或密码错误");
      }
    } else {
      console.log("用户不存在");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/profile", async (req, res) => {
  //验证token获取用户信息
  const raw = String(req.headers.authorization); //获取headers中的token
  const id = jwt.verify(raw, SECRET); //使用密钥解密token得到id
  const user = await User.findById(id); //通过id查找用户
  res.send(user);
});

app.get("/api/upload", (req, res) => {
  try {
    res.sendFile(__dirname + "/view/upload.html");
  } catch (error) {}
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const raw = req.cookies.token;
  const id = jwt.verify(raw, SECRET);
  const user = User.findById(id);
  if (user) {
    req.file.path = "http://localhost:3000/uploads/" + req.file.filename;
    console.log(req.file);
    console.log("用户验证通过...上传成功");
    const filename = req.file.originalname;
    const path = req.file.path;
    const size = req.file.size;
    const file = await File.create({
      filename,
      size,
      path
    });
    file.save();
    res.end();
  }
});

app.get("/api/download", async (req, res) => {
  res.download("uploads/29b35e6136101e9168028e1c07312d6e", "zs.jpg");
});
app.listen(3000, async (req, res) => {
  console.log("http://localhost:3000");
});
