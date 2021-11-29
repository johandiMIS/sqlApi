const {Router}  = require("express");
const controller = require("./controller")

const router = new Router();

router.get('/', controller.getAll);

module.exports = router;
