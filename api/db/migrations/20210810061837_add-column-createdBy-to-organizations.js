const TABLE_NAME = 'organizations';
const COLUMN_NAME = 'createdBy';
const REFERENCED_COLUMN_NAME = 'users.id';

const up = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.integer(COLUMN_NAME).unsigned().references(REFERENCED_COLUMN_NAME);
  });
};

const down = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn(COLUMN_NAME);
  });
};

export { up, down };
