const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 8080;

http.createServer(function(request,response){

    var filePath ='.' + request.url;
    if(filePath=='./'){
        filePath = './public/html/convert.html';
    }

    console.log('requested file is '+filePath);
    var fileExtention = path.extname(filePath);
    var contentType = 'text/html';
    switch(fileExtention){
        case '.js':
            contentType = 'text/javascript';
            break;
    }

    fs.exists(filePath,function(exists){
        if(exists){
            fs.readFile(filePath,function(error,content){
                if(error){
                    response.writeHead(500);
                    response.end();
                }
                else{
                    response.writeHead(200,{'Content-Type':contentType});
                    response.end(content,'utf-8');
                }
            });
        }
        else{
            response.writeHead(404);
            response.end();
        }
    }); 

}).listen(PORT);
console.log('server listening on port '+PORT);
