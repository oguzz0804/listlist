const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('express-cors')
const compression = require('compression')
const http = require('http');
const schema = require('./schema');

const app = express();

const loggingMiddleware = (req, res, next) => {
  let reqIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if(reqIP.substr(0, 7) === "::ffff:") {
    reqIP = reqIP.substr(7);
  }

  if(reqIP === "::1" || reqIP === "127.0.0.1"){
    reqIP = "50.70.197.94";
  }

  global.requestIP = reqIP;
  next();
}

// gzip compression
app.use(compression());

//设置跨域访问
app.use(cors({
  allowedOrigins: [
    'http://localhost:3000',
  ]
}));

app.use(loggingMiddleware);

app.use('/', graphqlHTTP({
  graphiql: true,
  schema: schema
}));

// Handle 404 and 500
app.use(function(req, res) {
  res.type('text/plain');
  res.status(404);
  res.json({
      code: 1,
      message: 'Error 404'
  });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.json({
      code: 500,
      message: 'Error 500, ' + err
  });
});

const httpServer = http.createServer(app);

httpServer.listen(4000,'0.0.0.0', () => console.log(`Listening on port 4000!`))