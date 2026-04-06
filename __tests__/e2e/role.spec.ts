import { Server } from '../../src/server/server';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { RoleBuilder } from '../utils/builders/role-builder';

import { clearDatabaseAuth } from '../utils/db';
import { UserBuilder } from '../utils/builders/user-builder';

const server = new Server();
const baseUrl = '/api/v1/parameter/roles';

beforeAll(async () => {
  await server.startServer();
  await clearDatabaseAuth();
});

afterEach(async () => {
  await clearDatabaseAuth();
});

afterAll(async () => {
  await server.stopServer();
});

describe('E2E: Role', () => {
  describe('POST', () => {
    it('Create a role with valid body', async () => {
      await new RoleBuilder().buildResources();
      const body = {
        name: faker.lorem.word(),
        description: faker.lorem.word(),
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        listOfAccess: [
          {
            resource: '76576cf3-09e5-4172-8acf-de56c49e75e7',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: '4142c1ab-e3e5-43c4-979a-001c779cc150',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: 'dd688388-e528-4c73-9f68-88faa7ad933a',
            canAccess: faker.helpers.arrayElement([true, false])
          }
        ]
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(201).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Role created successfully');
    });

    it('Reject request if body has not resources', async () => {
      await new RoleBuilder().buildResources();
      const body = {
        name: faker.lorem.word(),
        description: faker.lorem.word(),
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        listOfAccess: []
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message', 'Array must contain at least 1 element(s)');
    });

    it('Reject request if body has resources that do not exist', async () => {
      await new RoleBuilder().buildResources();
      const body = {
        name: faker.lorem.word(),
        description: faker.lorem.word(),
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        listOfAccess: [
          {
            resource: '76576cf3-09e5-4172-8acf-de56c49e75e7',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: '4142c1ab-e3e5-43c4-979a-001c779cc150',
            canAccess: faker.helpers.arrayElement([true, false])
          }
        ]
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'You must send all available resources');
    });

    it('Reject request if body have not require parameters', async () => {
      await new RoleBuilder().buildResources();
      const body = {
        description: faker.lorem.word(),
        listOfAccess: [
          {
            resource: '76576cf3-09e5-4172-8acf-de56c49e75e7',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: '4142c1ab-e3e5-43c4-979a-001c779cc150',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: 'dd688388-e528-4c73-9f68-88faa7ad933a',
            canAccess: faker.helpers.arrayElement([true, false])
          }
        ]
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('path', ['name']);
      expect(response.body.message[1]).toHaveProperty('path', ['status']);
    });

    it('Reject request if body have id of resource that does not exist', async () => {
      await new RoleBuilder().buildResources();
      const fakerUUID = faker.string.uuid();
      const body = {
        name: faker.lorem.word(),
        description: faker.lorem.word(),
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        listOfAccess: [
          {
            resource: '76576cf3-09e5-4172-8acf-de56c49e75e7',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: '4142c1ab-e3e5-43c4-979a-001c779cc150',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: 'dd688388-e528-4c73-9f68-88faa7ad933a',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: fakerUUID,
            canAccess: faker.helpers.arrayElement([true, false])
          }
        ]
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', `Resource not found: ${fakerUUID}`);
    });
  });

  describe('PUT', () => {
    it('Update a role with valid body', async () => {
      const role = await new RoleBuilder().withAccessResources().build();
      const body = {
        name: faker.lorem.word(),
        description: faker.lorem.word(),
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        listOfAccess: [
          {
            resource: '76576cf3-09e5-4172-8acf-de56c49e75e7',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: '4142c1ab-e3e5-43c4-979a-001c779cc150',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: 'dd688388-e528-4c73-9f68-88faa7ad933a',
            canAccess: faker.helpers.arrayElement([true, false])
          }
        ]
      };

      const response = await request(server.getApp())
        .put(`${baseUrl}/${role.id}`)
        .send(body)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Role updated successfully');
    });

    it('Reject request if body has not resources', async () => {
      const role = await new RoleBuilder().withAccessResources().build();
      const body = {
        name: faker.lorem.word(),
        description: faker.lorem.word(),
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        listOfAccess: []
      };

      const response = await request(server.getApp())
        .put(`${baseUrl}/${role.id}`)
        .send(body)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message', 'Array must contain at least 1 element(s)');
    });

    it('Reject request if body have not require parameters', async () => {
      const role = await new RoleBuilder().withAccessResources().build();
      const body = {
        description: faker.lorem.word(),
        listOfAccess: [
          {
            resource: '76576cf3-09e5-4172-8acf-de56c49e75e7',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: '4142c1ab-e3e5-43c4-979a-001c779cc150',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: 'dd688388-e528-4c73-9f68-88faa7ad933a',
            canAccess: faker.helpers.arrayElement([true, false])
          }
        ]
      };

      const response = await request(server.getApp())
        .put(`${baseUrl}/${role.id}`)
        .send(body)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('path', ['name']);
      expect(response.body.message[1]).toHaveProperty('path', ['status']);
    });

    it('Rejects request if body have id of resource that does not exist', async () => {
      const role = await new RoleBuilder().withAccessResources().build();
      const fakerUUID = faker.string.uuid();
      const body = {
        name: faker.lorem.word(),
        description: faker.lorem.word(),
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        listOfAccess: [
          {
            resource: '76576cf3-09e5-4172-8acf-de56c49e75e7',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: '4142c1ab-e3e5-43c4-979a-001c779cc150',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: 'dd688388-e528-4c73-9f68-88faa7ad933a',
            canAccess: faker.helpers.arrayElement([true, false])
          },
          {
            resource: fakerUUID,
            canAccess: faker.helpers.arrayElement([true, false])
          }
        ]
      };

      const response = await request(server.getApp())
        .put(`${baseUrl}/${role.id}`)
        .send(body)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', `Resource not found: ${fakerUUID}`);
    });
  });

  describe('DELETE', () => {
    it('Delete a role with valid id', async () => {
      const role = await new RoleBuilder().withAccessResources().build();
      const response = await request(server.getApp()).delete(`${baseUrl}/${role.id}`).expect(200).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Role deleted successfully');
    });

    it('Reject request if id does not exist', async () => {
      const response = await request(server.getApp())
        .delete(`${baseUrl}/${faker.string.uuid()}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Role not found');
    });

    it('Reject request if id does not uuid', async () => {
      const response = await request(server.getApp()).delete(`${baseUrl}/abc`).expect(400).expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });

    it('Does not delete a role that it have active users', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      await new UserBuilder(role.id).withActiveStatus().build();

      const response = await request(server.getApp()).delete(`${baseUrl}/${role.id}`);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'You can not delete a role with active users');
    })
  });

  describe('GET', () => {
    it('Return array with all roles', async () => {
      const role = await new RoleBuilder().build();
      const response = await request(server.getApp())
        .get(`${baseUrl}?limit=20&page=1`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        id: role.id,
        name: role.name,
        description: role.description,
        status: role.status
      });
      expect(response.body.data[0].resources).toHaveLength(role.resources.length);

      const res = role.resources[0];

      expect(response.body.data[0].resources.filter((r: any) => r.id === res.id)[0]).toMatchObject({
        id: res.id,
        slug: res.slug,
        description: res.description,
        canAccess: res.canAccess
      });
    });

    it('Return empty array if has not roles', async () => {
      const response = await request(server.getApp())
        .get(`${baseUrl}?limit=20&page=1`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(0);
    });

    it('Return role data from valid id', async () => {
      const role = await new RoleBuilder().build();
      const response = await request(server.getApp()).get(`${baseUrl}/${role.id}`).expect(200).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject({
        id: role.id,
        name: role.name,
        description: role.description,
        status: role.status
      });
      expect(response.body.data.resources).toHaveLength(role.resources.length);

      const res = role.resources[0];

      expect(response.body.data.resources.filter((r: any) => r.id === res.id)[0]).toMatchObject({
        id: res.id,
        slug: res.slug,
        description: res.description,
        canAccess: res.canAccess
      });
    });

    it('Reject request if id does not exist', async () => {
      const response = await request(server.getApp())
        .get(`${baseUrl}/${faker.string.uuid()}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Role not found');
    });

    it('Reject request if id does not uuid', async () => {
      const response = await request(server.getApp()).get(`${baseUrl}/abc`).expect(400).expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });

    it('Return array with resources available', async () => {
      const role = await new RoleBuilder().build();
      const response = await request(server.getApp()).get(`${baseUrl}/resources`).expect(200).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(role.resources.length);

      const res = role.resources[0];

      expect(response.body.data.filter((r: any) => r.id === res.id)[0]).toMatchObject({
        id: res.id,
        slug: res.slug,
        description: res.description
      });
    });
  });
});
