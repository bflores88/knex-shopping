
exports.up = function(knex, Promise) {
  return knex.schema.createTable('purchases', (table) => {
    table.increments();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('purchases');
};