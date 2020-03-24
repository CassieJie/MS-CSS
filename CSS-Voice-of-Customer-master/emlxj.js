//Read ems file
var fs = require('fs');
var emlformat = require('eml-format');
var exec = require('child_process').execSync;
//delete  file
function delFile(path){
    fs.unlink(path,function(error){
        if(error){
            console.log(error);
            return false;
        }
        console.log('删除eml文件成功');
    })
}

function Case(id,engineer,date,badge,voice){
    this.caseId = id;
    this.cengineer = engineer;
    this.cdate = date;
    this.cbadge = badge;
    this.customeVoice = voice;
}
//eml处理
function parseRawEml(fileName,path) {
    console.log("start eml parse!");
    var eml = fs.readFileSync(path+fileName, "utf-8");

    emlformat.parse(eml, function(error, data) {
        if (error) return console.log(error);
//write to json
        fs.writeFileSync(path+'json/'+fileName+".json", JSON.stringify(data, " ", 2));
    });

//Read json file and extract html
   var data = fs.readFileSync(path+'json/'+fileName+".json","utf-8");
        //js对象
        var jsObject = JSON.parse(data);
        //get header
        var header = jsObject.headers;
        //engineer
        var str1 = header.To;
        var engName = str1.replace(/\s<.*>$/g,"");
        // console.log(typeof engName);
        // console.log("Print:engineer's name ="+engName);
        //Date
        str1 = header.Date;
        var dat = str1.match(/\b[A-Z][a-z]{2}\b\s\d{4}/g).toString();
        //get body
        var body = jsObject.body[0].part.body[1].part.body;
        // console.log("body is1 ---"+body);
        // body=body.replace(/\r\n/g," ");
        body=body.replace(/=\r\n/g,"");
        body=body.replace('/\=[\s]+/gm',"");

        body=body.replace(/\r\n/g," ");
        // fs.writeFileSync('3.json',body);
        //根据caseid定位段落
        var pagraph = body.match(/<font class=[3D]*"verbatimtext">'.*\s[0-9]{15}<\/p>/g).toString();
        var s = pagraph.split(/<\/p>/g);
//构造Case对象
        var jarry = new Array();
//处理paragraph
        for (var i=0;i<s.length-1;i++){
            var st1 = JSON.stringify(s[i]);
            console.log("ST1是"+st1);
            //CaseID
            var id = st1.match(/SR\s\d{15}/g).toString();
            //voice
            var voice = null;
            if (st1.match(/Microsoft Translator - English/g)){
                var midstring = st1.split('<br>')[1];
                voice = midstring.split('Microsoft Translator - English: ')[1];
            } else{
                // voice = st1.match(/'[\w|.|,|\s|{|}]+'/g).toString();
                voice = st1.match(/'[\w\s.&\-_;{},|]+'/g).toString();
                voice = voice.slice(1,-1);

            }
            var mid = st1.match(/<font color=[3D]*\\"#[\w\s=]*\\">([\s\w=])+</g).toString();
            var badge = mid.match(/>[\w\s=]*</g);
            for (let j = 0; j < badge.length; j++) {
                badge[j]="upload/"+badge[j].slice(1,-1)+".png";
                console.log(badge[j]);
            }
            var obj1 = new Case(id,engName,dat,badge,voice);
            jarry.push(obj1);

        }
    delFile(path+'json/'+fileName+".json");
    return jarry;
}

//调用
// parseRawEml("1.eml","./pythonParseMsg/emlFile/");


// ｐｙｔｈｏn执行
function pythonParseMsg(path1,path2) {
    exec('python3.7 '+path1+' '+path2,function(error,stdout,stderr){
        if(error) {
            console.info('stderr : '+stderr);
        }
        console.log('exec: ' + stdout);
    });

    console.log("finish parse" );

}
//去掉字符串首尾空格
function trimStr(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}
//msg处理
function parseRawMsg(path1,filename) {

    pythonParseMsg("./pythonParseMsg/outlookmsgfile.py",path1+filename);
    var path2 = './pythonParseMsg/msgFile/emlOutPut/';
    var eml = fs.readFileSync(path2 + filename + '.eml', "utf-8");
    //eml to json
    var path3 = './pythonParseMsg/msgFile/json/';
    emlformat.parse(eml, function (error, data) {
        if (error) return console.log(error);
        fs.writeFileSync(path3 + filename + ".json", JSON.stringify(data, " ", 2));
    });
    delFile(path2 + filename + '.eml');
    //sync
    var data =  fs.readFileSync(path3 + filename + ".json","utf-8");

    //js对象
    var jsObject = JSON.parse(data);
    //get header
    var header = jsObject.headers;
    //engineer
    var str1 = header.To;
    var engName = str1.replace(/\s<.*>$/g, "");
    console.log(engName);
    //Date
    str1 = header.Date;
    var dat = str1.match(/\b[A-Z][a-z]{2}\b\s\d{4}/g).toString();
    //get body
    var body = jsObject.body[0].part.body;
    body = body.replace(/=\r\n/g, "");
    body = body.replace('/\=[\s]+/gm', "");
    body = body.replace(/\r\n/g, " ");
    fs.writeFileSync('3.json', body);
    //根据caseid定位段落
    var pagraph = body.split(/\s'|\s"/g);

    if (body.match(/Microsoft Translator/g)){
        pagraph = pagraph.slice(2);
    }else{
        pagraph = pagraph.slice(1);  //去第一个元素
    }
    console.log("Paragraph is=" + pagraph);
    //处理paragraph
    var jarray = new Array();
    for (var i = 0; i < pagraph.length; i++) {
        var st1 = pagraph[i];
        console.log("st1="+st1);
        //CaseID
        var id = st1.match(/SR\s\d{15}/g).toString();
        console.log("id is=" + id);
        //voice
        var voice = null;
        voice = st1.match(/^.*['"]\s/g);
        voice = voice[0].split(/\.['\"]/g)[0];
        //badge
        var mid = st1.match(/\s[\w\s|]*\sSR/g);
        mid = mid[0].split(' SR')[0];
        var mid2 = mid.split('|');
        var badge = new Array();

        mid2.forEach(function (val,index) {
        // console.log(val+"下标是"+index);
        val = trimStr(val);
        badge[index] ="upload/"+ val+".png";
        });
        var obj1 = new Case(id, engName, dat, badge, voice);
        console.log("Print msg parse data----------");
        jarray.push(obj1);
    }
   delFile(path3 + filename + ".json");
    return jarray;
}

module.exports = {parseRawEml,parseRawMsg};