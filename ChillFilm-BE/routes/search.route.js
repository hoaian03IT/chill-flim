const express = require('express');
const { searchFilms, getFilms } = require('../controllers/search.controller');
const router = express.Router();

router.get('/search', searchFilms);
router.get('/get', getFilms);
module.exports = router;