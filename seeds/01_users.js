
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email: 'heygirlhey@gmail.com', password: 'testpass'},
        {email: 'ilikecats@gmail.com', password: 'meowmeowmeow'},
        {email: 'whatsgood@gmail.com', password: 'tunaR0ll'},
      ]);
    });
};
