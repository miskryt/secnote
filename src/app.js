const https = require('https');
const fs = require('fs');
const url = require('url');

const options = {
    /*
    * Используем синхронное чтение, чтобы сертификат точно был загружен до старта сервера
    * */
    key: fs.readFileSync("ssl/key.pem"),
    cert: fs.readFileSync("ssl/cert.pem"),

};

https.createServer(options, requestListener).listen(3000);


// Воспользуемся хойстингом, чтобы расположить длинную функцию внизу
function requestListener(req, res)
{
    const reqUrl = url.parse(req.url).pathname;

    if(reqUrl === '/')
    {
        res.writeHead(200, {'Content-Type' : 'text/html'});

        fs.readFile('public/index.html', null, (error, data) =>
        {
            if(error)
            {
            }
            else
            {
                res.write(data);
            }

            res.end();
        })
    }
    else
    {
        fs.readFile('public/404.html', function(error, data) {
            res.writeHead(404, {'content-type': 'text/html'});
            res.end(data);
        });
    }


}