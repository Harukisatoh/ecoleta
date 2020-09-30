import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('recyclable_items').insert([
        { name: 'Lâmpadas', image_url: 'lampadas.svg' },
        { name: 'Pilhas e Baterias', image_url: 'baterias.svg' },
        { name: 'Papéis e Papelão', image_url: 'papeis-papelao.svg' },
        { name: 'Resíduos Eletrônicos', image_url: 'eletronicos.svg' },
        { name: 'Resíduos Orgânicos', image_url: 'organicos.svg' },
        { name: 'Óleo de cozinha', image_url: 'oleo.svg' }
    ]);
}
