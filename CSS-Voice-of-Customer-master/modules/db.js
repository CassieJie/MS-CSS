// 数据库操作
var MongoClient = require('mongodb').MongoClient;
var  DbUrl = 'mongodb://localhost:27017/';
var dbName = 'CSSDataManage';


function __connectDb(callback){
    MongoClient.connect(DbUrl,{useNewUrlParser: true },function (err,client) {
        if(err){
            console.log('数据库连接失败');
            return;
        }
        // 增删改
        var db = client.db(dbName);

        callback(db,client);
    })
}

// 暴露CaseID
// exports.CaseID=CaseID;


//数据库查找
/*
Db.find('engineer',{},function(err,data){

})
*/

exports.find = function(collectionname,json,callback) {

    __connectDb(function (db, client) {
        var result = db.collection(collectionname).find(json);
        result.toArray(function (error, data) {

            callback(error, data);
            client.close();
        })
    })
}


//增加数据
exports.insert = function(collectionname,json,callback){

    __connectDb(function(db,client){
        db.collection(collectionname).insertOne(json,function(error,data){
            callback(error,data);
            client.close();
        })
    })
}

//修改数据
exports.update = function(collectionname,json1,json2,callback){

    __connectDb(function(db,client){
        db.collection(collectionname).updateOne(json1,{$set:json2},function(error,data){
            callback(error,data);
            client.close();
        })
    })
}


//删除数据
exports.deleteOne = function(collectionname,json,callback){

    __connectDb(function(db,client){
        db.collection(collectionname).deleteOne(json,function(error,data){
            callback(error,data);
            client.close();
        })
    })
}