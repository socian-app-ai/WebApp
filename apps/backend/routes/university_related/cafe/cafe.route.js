const express = require('express');
const router = express.Router();

const cafeProtectedRoutes = require('./protected/cafe.protected.routes');
const cafeProtect = require('../../../middlewares/cafe.protect');
app.use('/user', cafeProtect, cafeProtectedRoutes)



module.exports = router;