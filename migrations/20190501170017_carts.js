
exports.up = function(knex, Promise) {
  return knex.schema.createTable('carts', (table) => {
    table.increments();
    table.integer('user_id').references('id').inTable('users');
    table.integer('product_id').references('id').inTable('products');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('carts');
};