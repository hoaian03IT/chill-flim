const axios = require("axios");

const http = axios.create({
    headers: {
        accept: "application/json",
        Authorization: "Bearer " + process.env.API_READ_ACCESS_TOKEN_TMDB,
    },
});

class FilmController {
    static async fetchFilmFromProvider() {
        try {
            let results = await http.get("https://api.themoviedb.org/3/movie/popular");
            console.log(results.data);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = { FilmController };
