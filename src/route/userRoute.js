const {Router}  = require("express");
const router = new Router();
const controller = require('../controller/userController')
router.get('/getall', controller.GetAll);
router.post('/signup', controller.SignUp);
router.get('/*', controller.DefaultRoute);
module.exports = router;
