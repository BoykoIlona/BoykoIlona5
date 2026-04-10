const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url !== '/json-calc' || req.method !== 'POST') {
    res.writeHead(404);
    return res.end();
  }

  const chunks = [];

  req.on('data', chunk => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    try {
      const raw = Buffer.concat(chunks).toString();
      const parsed = JSON.parse(raw);

      const { a, b, operation } = parsed;

      if (typeof a !== 'number' || typeof b !== 'number' || typeof operation !== 'string') {
        res.writeHead(422);
        return res.end();
      }

      let calcResult = 0;

      switch (operation) {
        case 'add':
          calcResult = a + b;
          break;
        case 'subtract':
          calcResult = a - b;
          break;
        case 'multiply':
          calcResult = a * b;
          break;
        case 'divide':
          if (b === 0) {
            res.writeHead(400);
            return res.end();
          }
          calcResult = a / b;
          break;
        default:
          res.writeHead(400);
          return res.end();
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ result: calcResult }));
      
    } catch (err) {
      res.writeHead(400);
      res.end();
    }
  });
});

server.listen(process.argv[2] || 3000);