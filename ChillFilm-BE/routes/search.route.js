const express = require('express');
const { searchFilms } = require('../controllers/search.controller');
const router = express.Router();

router.get('/search', searchFilms);

module.exports = router;