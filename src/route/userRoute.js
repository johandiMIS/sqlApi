const {Router}  = require("express");
const router = new Router();
const controller = require('../controller/userController')
router.get('/getall', controller.GetAll);
router.post('/signup', controller.SignUp);
router.post('/signup2', controller.SignUp2);
router.get('/*', controller.DefaultRoute);
module.exports = router;
