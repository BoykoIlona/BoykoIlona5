const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url !== '/json-array' || req.method !== 'POST') {
    res.writeHead(404);
    return res.end();
  }

  const chunks = [];

  req.on('data', chunk => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    try {
      const bodyString = Buffer.concat(chunks).toString();
      const payload = JSON.parse(bodyString);

      if (!Array.isArray(payload.numbers)) {
        res.writeHead(422);
        return res.end();
      }

      const hasInvalidNumbers = payload.numbers.some(num => typeof num !== 'number');
      
      if (hasInvalidNumbers) {
        res.writeHead(422);
        return res.end();
      }

      const len = payload.numbers.length;
      const total = len > 0 ? payload.numbers.reduce((acc, curr) => acc + curr, 0) : 0;
      const avg = len > 0 ? total / len : 0;

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        count: len,
        sum: total,
        average: avg
      }));
      
    } catch (error) {
      res.writeHead(400);
      res.end();
    }
  });
});

server.listen(process.argv[2] || 3000);