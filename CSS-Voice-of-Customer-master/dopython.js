const exec = require('child_process').exec;
// “Ï≤Ω÷¥––
exec('python3.7 ./pythonParseMsg/outlookmsgfile.py ./pythonParseMsg/msgFile/*.msg',function(error,stdout,stderr){
    if(error) {
        console.info('stderr : '+stderr);
    }
    console.log('exec: ' + stdout);
});
