
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', (table) => {
    table.increments();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.integer('inventory').unsigned().notNullable();
    table.decimal('price').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};