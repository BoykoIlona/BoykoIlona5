const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url !== '/json-echo' || req.method !== 'POST') {
    res.writeHead(404);
    return res.end();
  }

  const chunks = [];

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const requestData = Buffer.concat(chunks).toString();

    if (!requestData) {
      res.writeHead(400);
      return res.end();
    }

    let parsedJson;

    try {
      parsedJson = JSON.parse(requestData);
    } catch (err) {
      res.writeHead(400);
      return res.end('Invalid JSON');
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(parsedJson));
  });
});

server.listen(process.argv[2] || 3000);