export function up(knex) {
  return knex.schema.createTable('developments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('location').notNullable();
    table.text('description').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('developments');
}