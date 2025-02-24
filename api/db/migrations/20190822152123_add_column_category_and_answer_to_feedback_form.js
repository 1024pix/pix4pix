const TABLE_NAME = 'feedbacks';
const COLUMN_CATEGORY = 'category';
const COLUMN_ANSWER = 'answer';

const up = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.string(COLUMN_CATEGORY);
    table.string(COLUMN_ANSWER);
  });
};

const down = function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn(COLUMN_CATEGORY);
    table.dropColumn(COLUMN_ANSWER);
  });
};

export { up, down };
