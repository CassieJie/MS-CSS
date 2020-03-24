// var express=require('express');
// var router = express.Router();
//
// router.post('/eml',function(req,res){
//
// });
const express = require('express');
const formidable = require('formidable');
var router = express.Router();
// const app = express();

router.get('/', function(req, res){
    res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

router.post('/upload', function(req, res){
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ fields, files });
    });
});






// router.post('/msg',function(req,res){
//     var Date = req.body.Date;
//     console.log("search for ----"+Date);
//     // 2.连接数据库查询数据
//     if (Date == "") {
//         console.log("进入date=null函数")
//         DB.find('honor', {}, function (err, data) {
//             res.render('css', {
//                 list: data
//             })
//         })
//     }
//     else {
//         DB.find('honor', {
//             Date: Date,
//         }, function (err, data) {
//
//             console.log('/product的data数据是');
//             console.log(data)
//             if (data.length > 0) {
//                 res.render('css', {
//                     list: data
//                 })
//             } else {
//                 res.send("There is no match for search date")
//                 console.log("!!there is no match for search product")
//             }
//         })
//     }
// });
//
//
//
//
// module.exports = router;