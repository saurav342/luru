const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const rideRoute = require('./ride.route');
const carRoute = require('./car.route');
const bookingsRoute = require('./booking.route');
const driverRoute = require('./driver.route');
const carAssignmentRoute = require('./carAssignment.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/rides',
    route: rideRoute,
  },
  {
    path: '/cars',
    route: carRoute,
  },
  {
    path: '/drivers',
    route: driverRoute,
  },
  {
    path: '/carAssignments',
    route: carAssignmentRoute,
  },
  {
    path: '/bookings',
    route: bookingsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
