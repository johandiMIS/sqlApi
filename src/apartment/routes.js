const {Router}  = require("express");
const { route } = require("express/lib/application");
const { user } = require("pg/lib/defaults");
const controller = require("./controller");
const userControl = require("./userControl");
const router = new Router();

router.get('/', controller.getAll);
router.post('/signUp',userControl.signUp);
module.exports = router;
