var http = require("http");
const fs = require('fs');
let Parser = require("rss-parser");
let parser = new Parser({
    customFields:{
        item: [
            ['media:content', 'url', {keepArray:true}]
        ]
    }
});

async function readFeed() {

    let feed = await parser.parseURL("http://www.di.se/rss");

    let news = feed.items;

    news.sort((a, b) => new Date(a.pubDate) + new Date(b.pubDate))
    news = news.slice(0, 10);

    news.forEach( item => {
        console.log(item);
    });

    return news;
}

http.createServer(function(request, response) {
    switch (request.url) {
        case "/":
            //HTML SIDAN
            response.writeHead(200, { 'content-type': 'text/html' })
            fs.createReadStream('index.html').pipe(response)
            break
        case "/style.css":
            // CSS
            response.writeHead(200, { 'content-type': 'text/css' })
            fs.createReadStream('style.css').pipe(response)
            break
        case "/main.js":
            // JS
            response.writeHead(200, { 'content-type': 'text/javascript' })
            fs.createReadStream('main.js').pipe(response)
            break
        case "/feed":
            readFeed().then(news => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(news));
            });
            break
        default:
            response.writeHead(404);
            response.end(JSON.stringify({ error: "Not found :("}));
    }

}).listen(8080);

console.log('Server running...');
