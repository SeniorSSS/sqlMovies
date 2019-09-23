import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("06", "07");
    }, minutes(3));

    it(
        "should select top three directors ordered by total budget spent in their movies",
        async done => {
            const query = `
            SELECT directors.full_name as director, ROUND(SUM(movies.budget_adj),2) as total_budget
            FROM movies
            JOIN movie_directors ON movies.id = movie_directors.movie_id
            JOIN directors ON movie_directors.director_id = directors.id
            GROUP BY directors.id
            ORDER BY SUM(movies.budget_adj) DESC
            LIMIT 3
            `;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    director: "Steven Spielberg",
                    total_budget: 2173663066.68
                },
                {
                    director: "Ridley Scott",
                    total_budget: 1740157354.14
                },
                {
                    director: "Michael Bay",
                    total_budget: 1501996071.5
                }
            ]);

            done();
        },
        minutes(3)
    );

    it(
        "should select top 10 keywords ordered by their appearance in movies",
        async done => {
            const query = `
            SELECT keywords.keyword as keyword, COUNT(keywords.id) as count
            FROM movies
            JOIN movie_keywords ON movies.id = movie_keywords.movie_id
            JOIN keywords ON keywords.id = movie_keywords.keyword_id
            GROUP BY keywords.id
            ORDER BY COUNT(keywords.id) DESC
            LIMIT 10
            `;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    keyword: "woman director",
                    count: 411
                },
                {
                    keyword: "independent film",
                    count: 394
                },
                {
                    keyword: "based on novel",
                    count: 278
                },
                {
                    keyword: "sex",
                    count: 272
                },
                {
                    keyword: "sport",
                    count: 216
                },
                {
                    keyword: "murder",
                    count: 204
                },
                {
                    keyword: "musical",
                    count: 169
                },
                {
                    keyword: "biography",
                    count: 168
                },
                {
                    keyword: "new york",
                    count: 163
                },
                {
                    keyword: "suspense",
                    count: 157
                }
            ]);

            done();
        },
        minutes(3)
    );

    it(
        "should select one movie which has highest count of actors",
        async done => {
            const query = `
            SELECT movies.original_title, COUNT(*) AS count
            FROM movies
            JOIN movie_actors ON movies.id = movie_actors.movie_id
            GROUP BY movies.original_title
            ORDER BY count DESC
            LIMIT 1
            `;
            const result = await db.selectSingleRow(query);

            expect(result).toEqual({
                original_title: "Hamlet",
                count: 20
            });

            done();
        },
        minutes(3)
    );

    it(
        "should select three genres which has most ratings with 5 stars",
        async done => {
            const query = `
            SELECT genres.genre AS genre, COUNT(movie_ratings.movie_id) AS five_stars_count
            FROM movies
            JOIN genres ON genres.id = movie_genres.genre_id
            JOIN movie_genres ON movie_genres.movie_id = movies.id
            JOIN movie_ratings ON movie_ratings.movie_id = movies.id
            WHERE movie_ratings.rating = '5.0'
            GROUP BY genres.id
            ORDER BY COUNT(movie_ratings.movie_id) DESC
            LIMIT 3
            `;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    genre: 'Drama',
                    five_stars_count: 143663
                },
                {
                    genre: 'Thriller',
                    five_stars_count: 96265
                },
                {
                    genre: 'Comedy',
                    five_stars_count: 81184
                },
            ]);

            done();
        },
        minutes(3)
    );

    it(
        "should select top three genres ordered by average rating",
        async done => {
            const query = `
            SELECT genres.genre AS genre, ROUND(SUM(movie_ratings.rating)/COUNT(movie_ratings.movie_id),2) AS avg_rating
            FROM movies
            JOIN genres ON genres.id = movie_genres.genre_id
            JOIN movie_genres ON movie_genres.movie_id = movies.id
            JOIN movie_ratings ON movie_ratings.movie_id = movies.id
            GROUP BY genres.id
            ORDER BY SUM(movie_ratings.rating)/COUNT(movie_ratings.movie_id) DESC
            LIMIT 3
            `;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    genre: 'Western',
                    avg_rating: 3.64
                },
                {
                    genre: 'Crime',
                    avg_rating: 3.62
                },
                {
                    genre: 'Animation',
                    avg_rating: 3.6
                },
            ]);

            done();
        },
        minutes(3)
    );
});
