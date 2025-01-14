const TABLE_NAME = 'sessions';

const up = function (knex) {
  function table(t) {
    t.increments().primary();
    t.text('certificationCenter').notNullable();
    t.text('address').notNullable();
    t.text('room').notNullable();
    t.text('examiner').notNullable();
    t.date('date').notNullable();
    t.time('time').notNullable();
    t.text('description').defaultTo('');
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
  }

  return knex.schema.createTable(TABLE_NAME, table);
};

const down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { up, down };
