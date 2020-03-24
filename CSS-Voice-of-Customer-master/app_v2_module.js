var express=require('express');
var fd = require('formidable');
//引入模块
var admin =require('./routes/admin.js');
var index =require('./routes/index.js');
// var email = require('./routes/email_parse.js');
// var eml = require('./emlxj');

//PARSE EMAIL
// function test(){
//     console.log("调用了app的parse方法");
//     eml.parseRawEml("1.eml","pythonParseMsg/emlFile/");
//     eml.parseRawMsg('vy.msg');
// }
// test();


//创建管理员账号
var DB = require('./modules/db.js');

DB.insert('user',{
    _id:"admin",
    password:"cssadmin"
},function(err,data){
});


var app=new express();  /*实例化*/

// session保存用户信息
var session = require("express-session");
//配置中间件  固定格式
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:1000*60*30
    },
    rolling:true
}))

//使用ejs模板引擎   默认找views这个目录
app.set('view engine','ejs');


//配置public目录为我们的静态资源目录
app.use(express.static('public'));

// 配置虚拟目录
app.use('/upload',express.static('upload'));


// var index =require('./routes/index.js');
app.use('/',index);
//var admin =require('./routes/admin.js');
app.use('/admin',admin);
//Email parse
// app.use('/email_upload',email);
app.disable('view cache');



app.listen(3004,'127.0.0.1');


