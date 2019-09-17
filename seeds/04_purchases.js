
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('purchases').del()
    .then(function () {
      // Inserts seed entries
      return knex('purchases').insert([
        {user_id: 1, product_id: 1},
        {user_id: 2, product_id: 2}
      ]);
    });
};
