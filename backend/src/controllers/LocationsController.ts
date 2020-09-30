import { Request, Response } from 'express';
import knex from '../database/db-connection';

class LocationsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            lat,
            long,
            address_number,
            city,
            state,
            items
        } = request.body;

        const trx = await knex.transaction();

        try {
            const location = {
                name,
                email,
                whatsapp,
                lat,
                long,
                address_number,
                city,
                state,
                image_url: 'https://images.unsplash.com/photo-1549986584-6d9e49fd6495?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60&h=400'
            };

            const [location_id] = await trx('recycling_locations').insert(location);

            const location_items = items.map((item_id: Number) => {
                return {
                    item_id,
                    location_id
                }
            });

            await trx('location_accepted_items').insert(location_items);

            await trx.commit();

            return response.status(200).send({ location_id, ...location });
        } catch (error) {
            // For some reason, sending just the error above doesn't go with the message
            const errorWithMessage = {
                errno: error.errno,
                code: error.code,
                message: error.message
            };
            response.status(400).send(errorWithMessage);
            return await trx.rollback();
        }
    }

    async index(request: Request, response: Response) {
        const { city, state, items } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const locations = await knex('recycling_locations')
            .join('location_accepted_items', 'recycling_locations.id', '=', 'location_accepted_items.location_id')
            .select('recycling_locations.*')
            .distinct()
            // Where clause with optional parameters
            .modify((queryBuilder) => {
                if (city) {
                    queryBuilder.where('recycling_locations.city', String(city));
                }
                if (state) {
                    queryBuilder.where('recycling_locations.state', String(state));
                }
                if (items) {
                    queryBuilder.whereIn('location_accepted_items.item_id', parsedItems);
                }
            });

        return response.json(locations);
    }

    async show(request: Request, response: Response) {
        const requestedId = request.params.id;

        const location = await knex('recycling_locations').where('id', requestedId).first();

        if (!location) {
            return response.status(400).json({ message: 'Error: Location not found' });
        }


        const acceptedItems = await knex('recyclable_items')
            .select('recyclable_items.name', 'recyclable_items.image_url')
            .join('location_accepted_items', 'location_accepted_items.item_id', '=', 'recyclable_items.id')
            .where('location_accepted_items.location_id', requestedId);

        // SELECT recyclable_items.name, recyclable_items.image_url FROM recyclable_items
        // JOIN location_accepted_items ON location_accepted_items.item_id = recyclable_items.id
        // WHERE location_accepted_items.location_id = {requestedId};

        return response.json({ location, acceptedItems });
    }
};

export default LocationsController;
