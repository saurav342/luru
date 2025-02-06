const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

// Add this near the top of your file, after imports
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// Create an object to store our servers
const server = {
  app,
  httpServer: null,
  httpsServer: null,
  start: () => {
    if (config.env === 'production') {
      // SSL/HTTPS configuration
      const options = {
        cert: fs.readFileSync('/etc/letsencrypt/live/backend.malamacabs.com/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/backend.malamacabs.com/privkey.pem')
      };

      // Create HTTPS server
      server.httpsServer = https.createServer(options, app).listen(443, () => {
        console.log('HTTPS Server running on port 443');
      });

      // Redirect HTTP to HTTPS
      const httpApp = express();
      httpApp.use((req, res) => {
        res.redirect(`https://${req.hostname}${req.url}`);
      });
      server.httpServer = http.createServer(httpApp).listen(80, () => {
        console.log('HTTP Server running on port 80 (redirecting to HTTPS)');
      });
    } else {
      // For development/test environments, use regular HTTP
      server.httpServer = app.listen(config.port, () => {
        console.log(`HTTP Server running on port ${config.port}`);
      });
    }
  },
  close: (callback) => {
    if (server.httpServer) {
      server.httpServer.close();
    }
    if (server.httpsServer) {
      server.httpsServer.close();
    }
    if (callback) callback();
  }
};

module.exports = server;
