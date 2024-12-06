export function up(knex) {
  return knex.schema.createTable('receivables', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('clientId').notNullable().references('id').inTable('clients').onDelete('RESTRICT');
    table.uuid('developmentId').notNullable().references('id').inTable('developments').onDelete('RESTRICT');
    table.string('blockNumber').notNullable();
    table.string('lotNumber').notNullable();
    table.decimal('totalValue', 12, 2).notNullable();
    table.decimal('downPayment', 12, 2).notNullable();
    table.integer('installments').notNullable();
    table.date('firstInstallmentDate').notNullable();
    table.date('purchaseDate').notNullable();
    table.decimal('interestRate', 5, 2).notNullable();
    table.enum('status', ['active', 'completed', 'defaulted']).notNullable().defaultTo('active');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('receivables');
}