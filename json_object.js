const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url !== '/json-object' || req.method !== 'POST') {
    res.writeHead(404);
    return res.end();
  }

  const chunks = [];

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    try {
      const rawData = Buffer.concat(chunks).toString();
      const parsed = JSON.parse(rawData);

      const isNameValid = typeof parsed.name === 'string' && parsed.name.length > 0;
      const isAgeValid = typeof parsed.age === 'number';

      if (!isNameValid || !isAgeValid) {
        res.writeHead(422);
        return res.end();
      }

      const result = {
        greeting: "Hello " + parsed.name,
        isAdult: parsed.age >= 18 ? true : false
      };

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(result));
      
    } catch (err) {
      res.writeHead(400);
      res.end();
    }
  });
});

server.listen(process.argv[2] || 3000);