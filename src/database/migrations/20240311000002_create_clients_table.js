export function up(knex) {
  return knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('cpf').notNullable().unique();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('address').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('clients');
}