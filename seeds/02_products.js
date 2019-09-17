
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {title: 'DrevLeague', description: 'full time/part time', inventory: 17, price: 10000.00},
        {title: 'takoyaki', description: 'best balls ever', inventory: 100, price: 5.99},
        {title: 'Gobi', description: 'cute dog with underbite', inventory: 1, price: 999}
      ]);
    });
};
