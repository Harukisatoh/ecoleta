import Knex from 'knex';

export async function up (knex: Knex) {
    return knex.schema.createTable('recyclable_items', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('image').notNullable();
    });
}

export async function down (knex: Knex) {
    return knex.schema.dropTable('recyclable_items');
}