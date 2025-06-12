const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

router.post('/', createUser); // POST /api/users

module.exports = router;