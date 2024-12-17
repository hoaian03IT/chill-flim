const axios = require("axios");
const filmModel = require("../models/film.model");

const http = axios.create({
    headers: {
        accept: "application/json",
        Authorization: "Bearer " + process.env.API_READ_ACCESS_TOKEN_TMDB,
    },
});

class FilmController {
    static async fetchFilmFromProvider() {
        try {
            // https://image.tmdb.org/t/p/original/r8Ph5MYXL04Qzu4QBbq2KjqwtkQ.jpg

            let movies = [];
            for (let i = 1; i <= 1; i++) {
                let response = await http.get(`https://api.themoviedb.org/3/movie/popular?page=${i}`); // fetch movies
                for (let info of response.data.results) {
                    if (!info?.adult) {
                        let tmp = {};
                        tmp.title = info?.original_title;
                        tmp.language = info?.original_language;
                        tmp.overview = info?.overview;
                        tmp.poster = "https://image.tmdb.org/t/p/original" + info?.poster_path;

                        // Thực hiện các lệnh gọi API song song
                        const [movieDetails, movieVideos] = await Promise.all([
                            http.get(`https://api.themoviedb.org/3/movie/${info?.id}`),
                            http.get(`https://api.themoviedb.org/3/movie/${info?.id}/videos?language=en-US`),
                        ]);

                        // Lấy thông tin chi tiết
                        tmp.duration = movieDetails.data.runtime;
                        tmp.genre = movieDetails.data.genres.map((item) => item.name);

                        // Lấy thông tin video
                        let index = movieVideos.data.results.findIndex(
                            (item) => item.type === "Trailer" && item.site === "YouTube"
                        );

                        if (index < 0) continue;

                        tmp.url =
                            index !== -1
                                ? "https://www.youtube.com/watch?v=" + movieVideos.data.results[index].key
                                : null;

                        movies.push(tmp);

                        // Tạm dừng 1 giây giữa các lần xử lý phim
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                console.log(movies);
                                resolve();
                            }, 1000);
                        });
                    }
                }
            }

            await filmModel.insertMany(movies);

            // let results = await http.get("https://api.themoviedb.org/3/movie/945961/videos?language=en-US");
            // let results = await http.get("https://api.themoviedb.org/3/movie/changes");
            // let results = await http.get("https://api.themoviedb.org/3/certification/movie/list");
            // console.log(results.data);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = { FilmController };
