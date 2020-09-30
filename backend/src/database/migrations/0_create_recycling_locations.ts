import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('recycling_locations', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('lat').notNullable();
        table.decimal('long').notNullable();
        table.integer('address_number').notNullable();
        table.string('city').notNullable();
        table.string('state', 2).notNullable();
        table.string('image_url').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('recycling_locations');
}
