const express = require('express');
const router = express.Router();
const authController = require('../controller/user.controller');

router.use('/', authController);


module.exports = router;
