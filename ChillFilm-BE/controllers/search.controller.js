const Film = require('../models/film.model');
const redis_client = require('../db/redis_connect');
const searchFilms = async(req, res) => {
    try {
        const { title, genre, rate } = req.query;

        const query = {};
        if (title) query.title = { $regex: title, $options: 'i' };
        if (genre) query.genre = { $in: genre.split(',') };
        if (rate) query.rate = { $gte: parseFloat(rate) };
        const cacheKey = `films:${JSON.stringify(query)}`;

        const cachedFilms = await redis_client.get(cacheKey);

        //console.log('Cached films from Redis:', cachedFilms);
        if (cachedFilms) {
            return res.status(200).json({ status: true, data: JSON.parse(cachedFilms) });
        }

        const films = await Film.find(query);

        if (films.length === 0) {
            return res.status(404).json({ status: false, message: 'No films found.' });
        }
        await redis_client.set(cacheKey, JSON.stringify(films), { EX: 30 });

        return res.status(200).json({ status: true, data: films });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

// New API to get 10 random films
const getFilms = async(req, res) => {
    try {
        const films = await Film.aggregate([{ $sample: { size: 10 } }]);

        if (films.length === 0) {
            return res.status(404).json({ status: false, message: 'No films found.' });
        }

        return res.status(200).json({ status: true, data: films });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};
module.exports = { searchFilms, getFilms };