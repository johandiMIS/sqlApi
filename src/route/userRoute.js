const {Router}  = require("express");
const { route } = require("express/lib/application");
const router = new Router();
const controller = require('../controller/userController')

router.get('/testAuth', controller.Auth, controller.Test)
router.get('/getall', controller.GetAll);
router.get('/login', controller.LogIn)
router.post('/signup', controller.SignUp);
router.get('/*', controller.DefaultRoute);

module.exports = router;
