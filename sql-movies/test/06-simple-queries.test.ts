import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Simple Queries", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("05", "06");
  }, minutes(3));

  // IET
  

  it(
    "should select total budget and revenue from movies, by using adjusted financial data",
    async done => {
      const query = `
      SELECT ROUND(SUM(budget_adj),2) AS total_budget, 
             ROUND(SUM(revenue_adj),2) AS total_revenue 
      FROM movies
      `;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        total_budget: 190130349695.48,
        total_revenue: 555818960433.08
      });

      done();
    },
    minutes(3)
  );

  

  //Neiet
  
  it(
    "should select count from movies where budget was more than 100000000 and release date after 2009",
    async done => {
      const query = `
      SELECT  COUNT(*) AS count 
      FROM movies
      WHERE budget > 100000000
      AND strftime('%Y',release_date) > 2009
      `;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(282);

      done();
    },
    minutes(3)
  );
  
//Neiet

  it(
    "should select top three movies order by budget where release data is after 2009",
    async done => {
      const query = `
      SELECT original_title, budget, revenue
      FROM movies
      WHERE strftime('%Y',release_date) > 2009
      ORDER BY budget DESC
      LIMIT 3
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          original_title: "The Warrior's Way",
          budget: 425000000.0,
          revenue: 11087569.0
        },
        {
          original_title: "Pirates of the Caribbean: On Stranger Tides",
          budget: 380000000.0,
          revenue: 1021683000.0
        },
        {
          original_title: "Pirates of the Caribbean: At World's End",
          budget: 300000000.0,
          revenue: 961000000.0
        }
      ]);

      done();
    },
    minutes(3)
  );

  
//Iet

  it(
    "should select count of movies where homepage is secure (starts with https)",
    async done => {
      const query = `
      SELECT COUNT(*) as count 
      FROM movies
      WHERE homepage LIKE '%https%'
      `;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(82);

      done();
    },
    minutes(3)
  );

  
//Iet

  it(
    "should select count of movies released every year",
    async done => {
      const query = `
      SELECT COUNT(id) AS count, strftime('%Y',release_date) as year 
      FROM movies
      GROUP BY strftime('%Y',release_date)
      ORDER BY strftime('%Y',release_date) DESC
      `;
      const result = await db.selectMultipleRows(query);

      expect(result.length).toBe(56);
      expect(result.slice(0, 3)).toEqual([
        {
          count: 627,
          year: "2015"
        },
        {
          count: 696,
          year: "2014"
        },
        {
          count: 656,
          year: "2013"
        }
      ]);

      done();
    },
    minutes(3)
  );

  
//Iet
  it(
    "should select top three users which left most ratings",
    async done => {
      const query = `
      SELECT COUNT(user_id) AS count, user_id
      FROM movie_ratings
      GROUP BY user_id
      ORDER BY COUNT(user_id) DESC
      LIMIT 3
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          user_id: 8659,
          count: 349
        },
        {
          user_id: 179792,
          count: 313
        },
        {
          user_id: 107720,
          count: 294
        }
      ]);

      done();
    },
    minutes(3)
  );
  
//Iet? Nācās pārrakstīt testu
  it(
    "should select count of ratings left each month",
    async done => {
      const query = `
      SELECT COUNT(user_id) AS count, strftime('%m',time_created) AS month
      FROM movie_ratings
      GROUP BY strftime('%m',time_created)
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          count: 131934,
          month: "01"
        },
        {
          count: 108811,
          month: "02"
        },
        {
          count: 129070,
          month: "03"
          
        },
        {
          count: 119368,
          month: "04"
          
        },
        {
          
          
          count: 130411,
          month: "05"
        },
        {
          count: 136058,
          month: "06"
          
        },
        {
          
          count: 144545,
          month: "07"
        },
        {
          
          count: 127299,
          month: "08"
        },
        {
          count: 103819,
          month: "09"
          
        },
        {
          
          count: 141643,
          month: "10"
        },
        {
          
          count: 161252,
          month: "11"
        },
        {
          
          count: 146804,
          month: "12"
        }
      ]);

      done();
    },
    minutes(3)
  );
  
});
