const TABLE_NAME = 'assessments';

const up = function (knex) {
  function table(t) {
    t.increments().primary();
    t.string('courseId');
    t.string('userName').notNull();
    t.string('userEmail').notNull();
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  }

  return knex.schema.createTable(TABLE_NAME, table);
};

const down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { up, down };
