const TABLE_NAME = 'user-logins';

const up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.bigIncrements().primary();
    t.bigInteger('userId').references('users.id').notNullable().unique();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('blockedAt').nullable();
    t.dateTime('temporaryBlockedUntil').nullable();
    t.integer('failureCount').notNullable().defaultTo(0);
  });
};

const down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { up, down };
