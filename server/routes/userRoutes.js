const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword,
    deleteUser
} = require('../controllers/userController');

// Base route: /api/
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/', deleteUser);

module.exports = router;
