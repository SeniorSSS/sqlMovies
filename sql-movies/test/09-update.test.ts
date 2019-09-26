import _ from "lodash";
import { Database } from "../src/database";
import {
  selectGenreById,
  selectDirectorById,
  selectActorById,
  selectKeywordById,
  selectProductionCompanyById,
  selectMovieById
} from "../src/queries/select";
import { minutes } from "./utils";
import { escape } from "../src/utils";

describe("Update tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("08", "09");
    await db.execute("PRAGMA foreign_keys = ON");
  }, minutes(3));

it(
  "Should be able to change genre",
  async done => {
    const genreId = 9;

    await db.update(`UPDATE genres SET genre = 'Family friendly' WHERE id = '${genreId}'`);

    const genre = await db.selectSingleRow(selectGenreById(genreId));

    expect(genre.genre).toBe('Family friendly');
    
    done();
  }
);

  it(
    "Should be able to change director's name",
    async done => {
      const directorId = 18;
  
      await db.update(`UPDATE directors SET full_name = 'Kventins Tarantino' WHERE id = '${directorId}'`);
  
      const director = await db.selectSingleRow(selectDirectorById(directorId));
  
      expect(director.full_name).toBe('Kventins Tarantino');
      
      done();
    }
  );

  it(
    "Should be able to change keywords",
    async done => {
      const keywordId = 16;
  
      await db.update(`UPDATE keywords SET keyword = 'ship which flies in cosmos' WHERE id = '${keywordId}'`);
  
      const keyword = await db.selectSingleRow(selectKeywordById(keywordId));
  
      expect(keyword.keyword).toBe('ship which flies in cosmos');
      
      done();
    }
  );

  it(
    "Should be able to change product company",
    async done => {
      const companyId = 14;
  
      await db.update(`UPDATE production_companies SET company_name = 'sliktais robots' WHERE id = '${companyId}'`);
  
      const company = await db.selectSingleRow(selectProductionCompanyById(companyId));
  
      expect(company.company_name).toBe('sliktais robots');
      
      done();
    }
  );

it(
    "Should be able to add to actors name number [movies played = x]",
    async done => {
      const query = `
      SELECT actors.id as id, actors.full_name as full_name, COUNT(movie_actors.actor_id) as movies_played
      FROM actors
      JOIN movie_actors ON movie_actors.actor_id = actors.id
      GROUP BY actors.id
      `;
  
      const actorsWithMoviesPlayed = await db.selectMultipleRows(query);

      for (const actor of actorsWithMoviesPlayed) {
          await db.update(`UPDATE actors SET full_name = '${escape(actor.full_name)} [movies played = ${actor.movies_played}]' WHERE id = '${actor.id}'`);
      }

      const actorWithMostMovies = await db.selectSingleRow(selectActorById(234));

      expect(actorWithMostMovies.full_name).toBe('Robert De Niro [movies played = 72]');
      
      done();
    },
    minutes(30)
  );

it(
    "Should be able to add to most cheapest movie title [most cheapest]",
    async done => {
      const movie = await db.selectSingleRow(`
      SELECT * 
      FROM movies
      ORDER by budget_adj
      LIMIT 1`
      );
  
      await db.update(`UPDATE movies SET original_title = '${movie.original_title + " [most cheapest]"}' WHERE id = '${movie.id}'`);
  
      const updatedMovie = await db.selectSingleRow(selectMovieById(movie.id));
  
      expect(updatedMovie.original_title).toBe(`Mr. Holmes [most cheapest]`);
      
      done();
    }
  );

  it(
    "Should be able to change all ratings to 5.0 to specific movie",
    async done => {
    
      const query = `
      SELECT ROUND(AVG(movie_ratings.rating),1) as average
        FROM movies
        JOIN movie_ratings ON movie_ratings.movie_id = movies.id
        WHERE movies.id = '6554'
      `;
    
      await db.update(`UPDATE movie_ratings SET rating = '5.0' WHERE movie_id = '6554'`);
      
      const averageRating = await db.selectSingleRow(query);
      expect(averageRating.average).toBe(5.0);

      done();
    }
  );

});