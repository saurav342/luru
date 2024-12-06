const allRoles = {
  user: ['getRides', 'createRide', 'getAnUser'],
  admin: ['getUsers', 'manageUsers', 'updateCarDriver', 'manageCars', 'getCars', 'getRides'],
  driver: ['getDriverRides', 'updateRide', 'getRides']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
