import { Request, Response } from 'express';
import knex from '../database/db-connection';

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('recyclable_items').select('*');

        const serializedItems = items.map((item) => {
            return {
                id: item.id,
                name: item.name,
                image_url: `http://192.168.0.104:3333/uploads/${item.image_url}`
            }
        });

        return response.json(serializedItems);
    }
}

export default ItemsController;
