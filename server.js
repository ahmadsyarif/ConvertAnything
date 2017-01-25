const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const PORT = 8080;

http.createServer(function(request,response){

    var filePath ='.' + request.url;
    
    //home 
    if(filePath=='./'){
        filePath = "convert.html";
        githubPath = "https://raw.githubusercontent.com/ahmadsyarif/ConvertAnything/master/public/html/convert.html";
        console.log("copying convert.html from " + githubPath + " to " + filePath);
        
        var file = fs.createWriteStream(filePath);
        var request = https.get(githubPath, function(responseFromGithub){
            console.log("response from github : " +response.statusCode);
            if(responseFromGithub.statusCode ===200){

                responseFromGithub.pipe(file);
                
                fs.exists(filePath,function(exists){
                    console.log("file exist");
                    if(exists){
                        fs.readFile(filePath,function(error,content){
                            if(error){
                                console.error("couldn't read file "+filePath);
                                response.writeHead(500);
                                response.end();
                            }
                            else{
                                response.writeHead(200,{'Content-Type':"text/html"});
                                response.end(content,'utf-8');
                            }
                        });
                    }
                    else{
                        console.error("file not exist "+filePath);
                        response.writeHead(404);
                        response.end();
                    }
                }); 
            }
            else{
                response.writeHead(404);
                response.end();
            }
        }); 
        
    }    

}).listen(PORT);
console.log('server listening on port '+PORT);
