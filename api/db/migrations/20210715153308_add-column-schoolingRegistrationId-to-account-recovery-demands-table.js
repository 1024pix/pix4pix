const TABLE_NAME = 'account-recovery-demands';
const TABLE_COLUMN = 'schoolingRegistrationId';
const REFERENCED_COLUMN_NAME = 'schooling-registrations.id';

const up = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.integer(TABLE_COLUMN).unsigned().references(REFERENCED_COLUMN_NAME);
  });
};

const down = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn(TABLE_COLUMN);
  });
};

export { up, down };
