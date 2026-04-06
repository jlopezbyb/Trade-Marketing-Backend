import request from 'supertest';
import { faker } from '@faker-js/faker';

import { Server } from '../../src/server/server';
import { cleanDatabaseTagTesting } from '../utils/db';
import { TagMother } from '../utils/mother/tag-mother';
import { TagModel } from '../../src/contexts/shared/infrastructure/models/parameter/tag.model';

const baseUrl = '/api/v1/parameter/tag';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await cleanDatabaseTagTesting();
});

afterEach(async () => {
  await cleanDatabaseTagTesting();
});

afterAll(async () => {
  await server.stopServer();
});

describe('E2E: Tag', () => {
  describe('/parameter/tag', () => {
    describe('POST', () => {
      it('Crea tag con estructura de petición correcta', async () => {
        const tagRequest = TagMother.createTagRequest({});

        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(tagRequest)
          .expect(201)
          .expect('Content-Type', /json/);

        expect(response.body).toEqual({ message: 'Tag created successfully' });
        const tagDatabase = await TagModel.findAll({ raw: true });
        expect(tagDatabase).toHaveLength(1);
        expect(tagDatabase[0]).toMatchObject({
          name: tagRequest.name,
          description: tagRequest.description,
          status: tagRequest.status
        });
      });

      it('Se rechaza petición si la estructura de la petición es incorrecta', async () => {
        const response1 = await request(server.getApp())
          .post(`${baseUrl}`)
          .send({})
          .expect(400)
          .expect('Content-Type', /json/);

        const response2 = await request(server.getApp())
          .post(`${baseUrl}`)
          .send({
            name: faker.lorem.word(),
            description: faker.lorem.word()
          })
          .expect(400)
          .expect('Content-Type', /json/);

        expect(response1.body).toHaveProperty('message');
        expect(response1.body.message[0]).toHaveProperty('message');
        expect(response1.body.message[0]).toHaveProperty('code');

        expect(response2.body).toHaveProperty('message');
        expect(response2.body.message[0]).toHaveProperty('message');
        expect(response2.body.message[0]).toHaveProperty('code');

        const tags = await TagModel.findAll({ raw: true });
        expect(tags).toHaveLength(0);
      });
    });

    describe('GET', () => {
      it('Se recibe un arreglo de tags y un contador de páginas', async () => {
        await TagModel.create(TagMother.createTagEntity().toPrimitives());
        await TagModel.create(TagMother.createTagEntity().toPrimitives());
        await TagModel.create(TagMother.createTagEntity().toPrimitives());

        const response = await request(server.getApp())
          .get(`${baseUrl}?limit=50&page=1`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data).toHaveLength(3);
        expect(response.body.pageCounter).toBe(1);
      });

      it.skip('Se recibe un arreglo de tags según filtros de búsqueda', async () => {

      })

      it('Se rechaza la petición al evaluar el query "limit" y "page" sean inválidos', async () => {
        const response1 = await request(server.getApp())
          .get(`${baseUrl}?page=abc&limit=abc`)
          .expect(400);
        const response2 = await request(server.getApp())
          .get(`${baseUrl}?page=1`)
          .expect(400);
        const response3 = await request(server.getApp())
          .get(`${baseUrl}?limit=1`)
          .expect(400);
        const response4 = await request(server.getApp())
          .get(`${baseUrl}?page=-1&limit=-1`)
          .expect(400);

        expect(response1.body.message[0]).toHaveProperty(
          'message',
          'Limit must be number and should be greater than 0'
        );
        expect(response2.body.message[0]).toHaveProperty(
          'message',
          'Limit must be number and should be greater than 0'
        );
        expect(response3.body.message[0]).toHaveProperty(
          'message',
          'Page must be number and should be greater than 0'
        );
        expect(response4.body.message[0]).toHaveProperty(
          'message',
          'Number must be greater than or equal to 1'
        );
      });

      it('Retorna tag a partir de id (uuid) indicado', async () => {
        const tagEntity = TagMother.createTagEntity();
        await TagModel.create(tagEntity.toPrimitives());
        const tagDatabase = await TagModel.findAll({ raw: true });

        const response = await request(server.getApp())
          .get(`${baseUrl}/${tagEntity.id}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toBeInstanceOf(Object);
        expect(tagDatabase[0]).toMatchObject({
          id: response.body.data.id,
          name: response.body.data.name,
          description: response.body.data.description,
          status: response.body.data.status
        });
      });

      it('Se recibe un 404 al enviar un id (uuid) inexistente', async () => {
        const response = await request(server.getApp())
          .get(`${baseUrl}/${faker.string.uuid()}`)
          .expect(404);
        expect(response.body).toHaveProperty('message', 'Tag not found');
      });

      it('Se recibe un 400 al enviar un id inválido', async () => {
        const response = await request(server.getApp())
          .get(`${baseUrl}/abc`)
          .expect(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('code');
      });
    });

    describe('PUT', () => {
      it('Se actualiza una tag a partir de id (uuid) indicado', async () => {
        const tagEntity = TagMother.createTagEntity();
        await TagModel.create(tagEntity.toPrimitives());

        const tagRequest = TagMother.createTagRequest({});

        const response = await request(server.getApp())
          .put(`${baseUrl}/${tagEntity.id}`)
          .send(tagRequest)
          .expect(200);

        expect(response.body).toEqual({ message: 'Tag updated successfully' });
        const tagDatabaseAfterUpdate = await TagModel.findAll({ raw: true });
        expect(tagDatabaseAfterUpdate).toHaveLength(1);
        expect(tagDatabaseAfterUpdate[0]).toMatchObject({
          name: tagRequest.name,
          description: tagRequest.description,
          status: tagRequest.status
        });
      });

      it('Se recibe un 404 al enviar un id (uuid) inexistente', async () => {
        const response = await request(server.getApp())
          .put(`${baseUrl}/${faker.string.uuid()}`)
          .send(TagMother.createTagRequest({}))
          .expect(404);

        expect(response.body).toHaveProperty('message', 'Tag not found');
      });

      it('Se recibe un 400 al enviar un id inválido o un request inválido', async () => {
        const response = await request(server.getApp())
          .put(`${baseUrl}/abc`)
          .send(TagMother.createTagRequest({}))
          .expect(400);

        const response2 = await request(server.getApp())
          .put(`${baseUrl}/${faker.string.uuid()}`)
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('code');
        expect(response2.body).toHaveProperty('message');
        expect(response2.body.message[0]).toHaveProperty('message');
        expect(response2.body.message[0]).toHaveProperty('code');


      });
    });

    describe('DELETE', () => {
      it('Elimina una tag a partir de id (uuid) indicado', async () => {
        const tagEntity = TagMother.createTagEntity();
        await TagModel.create(tagEntity.toPrimitives());
        await TagModel.create({...tagEntity.toPrimitives(), id: faker.string.uuid()});

        const response = await request(server.getApp())
          .delete(`${baseUrl}/${tagEntity.id}`)
          .expect(200);

        expect(response.body).toEqual({ message: 'Tag deleted successfully' });
        const tagDatabaseAfterDelete = await TagModel.findAll({ raw: true });
        expect(tagDatabaseAfterDelete).toHaveLength(1);
      });

      it('Se recibe un 404 al enviar un id (uuid) inexistente', async () => {
        await TagModel.create(TagMother.createTagEntity().toPrimitives());

        const response = await request(server.getApp())
          .delete(`${baseUrl}/${faker.string.uuid()}`)
          .expect(404);

        const tags = await TagModel.findAll({ raw: true });
        expect(tags).toHaveLength(1);
        expect(response.body).toHaveProperty('message', 'Tag not found');
      });

      it('Se recibe un 400 al enviar un id inválido', async () => {
        const response = await request(server.getApp())
          .delete(`${baseUrl}/abc`)
          .expect(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('code');
      });

      it.skip('No se puede eliminar un tag relacionado con una asignación', async () => {
        const tagEntity = TagMother.createTagEntity();
        await TagModel.create(tagEntity.toPrimitives());
        await TagModel.create(TagMother.createTagEntity().toPrimitives());
        await TagModel.create(TagMother.createTagEntity().toPrimitives());
      });
    });
  });
});
