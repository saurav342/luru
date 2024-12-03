const driverService = require('../services/driver.service');

// Controller for getting assigned driver rides
const getAssignedDriverRide = async (req, res) => {
    // Logic to get assigned driver rides
    const rides = await driverService.getAssignedDriverRide(req.user.id);
    res.json(rides);
};

// Controller for updating rides
const updateRide = async (req, res) => {
    // Logic to update a ride
    const updatedRide = await driverService.updateRide(req.body);
    res.json(updatedRide);
};

module.exports = {
    getAssignedDriverRide,
    updateRide,
};