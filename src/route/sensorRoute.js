const {Router}  = require("express");
const { route } = require("express/lib/application");
const router = new Router();
const controller = require('../controller/sensorController')

router.post('/update', controller.UpdateSensor)
router.get('/*', controller.DefaultRoute);

module.exports = router;