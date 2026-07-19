/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. farmers
  await knex.schema.createTable('farmers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('contact_info');
    table.timestamps(true, true);
  });

  // 2. buyers
  await knex.schema.createTable('buyers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('type').notNullable(); // 'trader', 'corporate'
    table.string('contact_info');
    table.timestamps(true, true);
  });

  // 3. consumers
  await knex.schema.createTable('consumers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('contact_info');
    table.timestamps(true, true);
  });

  // 4. warehouses
  await knex.schema.createTable('warehouses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('location').notNullable();
    table.integer('capacity').notNullable();
    table.timestamps(true, true);
  });

  // 5. listings
  await knex.schema.createTable('listings', (table) => {
    table.increments('id').primary();
    table.integer('farmer_id').unsigned().references('id').inTable('farmers').onDelete('CASCADE');
    table.string('crop_type').notNullable();
    table.integer('quantity').notNullable();
    table.string('estimated_harvest_window');
    table.string('status').defaultTo('active');
    table.timestamps(true, true);
  });

  // 6. matches
  await knex.schema.createTable('matches', (table) => {
    table.increments('id').primary();
    table.integer('listing_id').unsigned().references('id').inTable('listings').onDelete('CASCADE');
    table.integer('buyer_id').unsigned().references('id').inTable('buyers').onDelete('CASCADE');
    table.float('match_score');
    table.timestamps(true, true);
  });

  // 7. bookings
  await knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary();
    table.integer('warehouse_id').unsigned().references('id').inTable('warehouses').onDelete('CASCADE');
    table.integer('listing_id').unsigned().references('id').inTable('listings').onDelete('CASCADE');
    // status: requested -> confirmed -> stored -> released
    table.string('status').defaultTo('requested').notNullable();
    table.timestamps(true, true);
  });

  // 8. preorders
  await knex.schema.createTable('preorders', (table) => {
    table.increments('id').primary();
    table.integer('consumer_id').unsigned().references('id').inTable('consumers').onDelete('CASCADE');
    table.integer('listing_id').unsigned().references('id').inTable('listings').onDelete('CASCADE');
    // status: reserved -> confirmed -> fulfilled -> cancelled
    table.string('status').defaultTo('reserved').notNullable();
    // stubbed for Data Science integration
    table.string('harvest_window'); 
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('preorders');
  await knex.schema.dropTableIfExists('bookings');
  await knex.schema.dropTableIfExists('matches');
  await knex.schema.dropTableIfExists('listings');
  await knex.schema.dropTableIfExists('warehouses');
  await knex.schema.dropTableIfExists('consumers');
  await knex.schema.dropTableIfExists('buyers');
  await knex.schema.dropTableIfExists('farmers');
};
