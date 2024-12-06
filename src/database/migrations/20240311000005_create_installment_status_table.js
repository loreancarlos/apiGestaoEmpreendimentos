export function up(knex) {
  return knex.schema.createTable('installmentStatus', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('receivableId').notNullable().references('id').inTable('receivables').onDelete('CASCADE');
    table.integer('installmentNumber').notNullable();
    table.date('dueDate').notNullable();
    table.decimal('value', 12, 2).notNullable();
    table.boolean('billIssued').notNullable().defaultTo(false);
    table.boolean('billPaid').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    
    // Composite unique constraint
    table.unique(['receivableId', 'installmentNumber']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('installmentStatus');
}