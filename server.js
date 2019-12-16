const  { User,bcrypt }  = require('./model/Model')

//const bcrypt = require('bcryptjs') //对密码进行散列加密和验证

const jwt = require('jsonwebtoken') //生成tokek令牌

const express = require('express')

const app = express()

const SECRET = 'gfiuqwhboi9bfnq2rffq' //token密钥

app.use(express.json())  //使用中间件拦截请求

app.post('/api/register',async (req,res) =>{ //注册接口
    try {
        const user = await User.create({    //创建UserModel实例，此处必须进行await，否则user接收不到创建的实例
            username:req.body.username,
            password:req.body.password
        })
        user.save()      //save（）方法将User写入数据库
        res.send(user)   //返回user对象
        console.log('写入成功')
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/login',async (req,res)=>{ //获取登录页接口
    try {
        res.status(200)
        res.sendFile(__dirname + '/view/登录页.html')
    } catch (error) {
    }
})
app.post('/api/login',async (req,res) =>{ //登录接口
    try {
        const user = await User.findOne({  //根据用户名查找到对应的用户
            username:req.body.username
        })
        console.log(user)
        if(user) {   //用户存在，验证密码
            const isVaildPassword = bcrypt.compareSync(req.body.password,user.password) //使用compare方法和数据库中的散列值比对
            if(isVaildPassword) {
                console.log('登录成功！')
                const token = jwt.sign(String(user._id),SECRET)     //用密钥和id生成token
                res.send({
                    user,
                    token
                })
            }else {
                console.log('用户名或密码错误')
            }
        }else {
            console.log('用户不存在')
        }

    } catch (error) {
        console.log(error)
    }
})

app.get('/api/profile',async (req,res) =>{ //验证token获取用户信息
    const raw = String(req.headers.authorization)  //获取headers中的token
    const id = jwt.verify(raw,SECRET)               //使用密钥解密token得到id
    const user = await User.findById(id)            //通过id查找用户
    res.send(user)
})

app.listen(3000,async (req,res) => {
    console.log('http://localhost:3000')
})