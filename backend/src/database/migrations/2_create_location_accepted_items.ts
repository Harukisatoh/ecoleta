import Knex from 'knex';

export async function up (knex: Knex) {
    return knex.schema.createTable('location_accepted_items', (table) => {
        table.increments('id').primary();
        
        table.integer('location_id').notNullable().references('id').inTable('recycling_locations');

        table.integer('item_id').notNullable().references('id').inTable('recyclable_items');
    });
}

export async function down (knex: Knex) {
    return knex.schema.dropTable('location_accepted_items');
}