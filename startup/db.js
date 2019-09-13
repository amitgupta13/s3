const knex = require("knex");
const knexFile = require("../knexfile");

// database instance holder
let dbInstance = null;

/**
 * Get current database instance.
 * @returns {knex} db instance.
 */
function db() {
  if (!dbInstance) {
    // init on first call
    if (process.env.NODE_ENV == null) {
      dbInstance = knex(knexFile["development"]);
    } else {
      dbInstance = knex(knexFile[process.env.NODE_ENV]);
    }
  }

  // return db
  return dbInstance;
}

/**
 * Database instance accessor.
 * @type {db}
 */
module.exports = db;
