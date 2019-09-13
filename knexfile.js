/**
 * Knex configurations
 */
const knexConfig = {
  client: "postgresql",
  connection: "postgres://postgres:hrhk@localhost:5432/s3poc",
  pool: {
    min: 2,
    max: 10
    // ,
    // afterCreate: (conn, cb) => {
    //   conn.query(`SE T timezone = 'UTC'`, err => {
    //     cb(err, conn);
    //   });
    // }
  },
  schemas: "public"
};

/**
 * Knex config for all environments. We don't use specicifc env based config in app.
 */
module.exports = {
  development: knexConfig,
  staging: knexConfig,
  production: knexConfig
};

// sequence for order Id
// CREATE SEQUENCE serial_order START 100000;
// ALTER TABLE "order" ALTER COLUMN "orderId" SET DEFAULT nextval('serial_order');
