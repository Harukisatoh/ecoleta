import { Request, Response } from 'express';
import knex from '../database/db-connection';

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('recyclable_items').select('*');

        const serializedItems = items.map((item) => {
            return {
                id: item.id,
                name: item.name,
                image: `http://localhost:3333/uploads/${item.image}`
            }
        });

        return response.json(serializedItems);
    }
}

export default ItemsController;