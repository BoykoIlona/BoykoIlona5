const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url !== '/json-nested' || req.method !== 'POST') {
    res.writeHead(404);
    return res.end();
  }

  const chunks = [];

  req.on('data', chunk => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    try {
      const payloadString = Buffer.concat(chunks).toString();
      const parsed = JSON.parse(payloadString);
      const userObj = parsed.user;

      if (!userObj || !Array.isArray(userObj.roles)) {
        res.writeHead(422);
        return res.end();
      }

      let hasAdmin = false;
      for (let i = 0; i < userObj.roles.length; i++) {
        if (userObj.roles[i] === 'admin') {
          hasAdmin = true;
          break;
        }
      }

      const out = {
        name: userObj.name,
        roleCount: userObj.roles.length,
        isAdmin: hasAdmin
      };

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(out));
      
    } catch (err) {
      res.writeHead(400);
      res.end();
    }
  });
});

server.listen(process.argv[2] || 3000);