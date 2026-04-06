import { Server } from '../../src/server/server';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { clearDatabaseAuth } from '../utils/db';
import { RoleBuilder } from '../utils/builders/role-builder';
import { UserBuilder } from '../utils/builders/user-builder';
import { UserHelper } from '../utils/helpers/user-helper';

const server = new Server();
const baseUrl = '/api/v1/parameter/users';

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

describe('E2E: User', () => {
  describe('POST', () => {
    it('Created a new user with valid data', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        username: faker.lorem.word({ length: 35 }),
        password: faker.internet.password({ length: 30 }),
        phone: '+(502) 45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: role.id
      };

      const response = await request(server.getApp()).post(baseUrl).send(body);
      console.log(response.body);

      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User created successfully');
    });

    it('When create a new user can get preference notifications', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        username: faker.lorem.word({ length: 35 }),
        password: faker.internet.password({ length: 30 }),
        phone: '+(502) 45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: role.id
      };

      await request(server.getApp()).post(baseUrl).send(body).expect(201).expect('Content-Type', /json/);

      const user = await UserHelper.getUserByRoleId(role.id);
      const response = await request(server.getApp())
        .get(`/api/v1/parameter/notifications/preferences/${user.id}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.notificationPreferences).toBeInstanceOf(Array);
      expect(response.body.data.notificationPreferences.length).toBeGreaterThan(0);
      expect(response.body.data.notificationPreferences.find((pref: any) => pref.enable === true)).toBeFalsy();
    });

    it('Reject request to trying create a user with username already exists', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        username: faker.lorem.word({ length: 35 }),
        password: faker.internet.password(),
        phone: '+(502) 45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: role.id
      };

      await request(server.getApp()).post(baseUrl).send(body).expect(201).expect('Content-Type', /json/);
      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('Reject request with invalid role id', async () => {
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        username: faker.lorem.word({ length: 35 }),
        password: faker.internet.password(),
        phone: '+(502) 45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: faker.string.uuid()
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(404).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Role not found');
    });

    it('Reject request with inactive role id', async () => {
      const role = await new RoleBuilder().withInactiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        username: faker.lorem.word({ length: 35 }),
        password: faker.internet.password(),
        phone: '+(502) 45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: role.id
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'You can not create a user with an inactive role');
    });

    it('Reject request if body has not require parameters', async () => {
      const body = {
        password: faker.internet.password(),
        phone: '+(502) 45573001'
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      response.body.message.forEach((message: any) => {
        expect(['name', 'username', 'email', 'status', 'role']).toContain(message.path[0]);
        expect;
      });
    });

    it('Reject request if phone number and email have wrong format', async () => {
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: 'mail',
        username: faker.lorem.word({ length: 35 }),
        password: faker.internet.password(),
        phone: '45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: faker.string.uuid()
      };

      const response = await request(server.getApp()).post(baseUrl).send(body).expect(400).expect('Content-Type', /json/);

      response.body.message.forEach((message: any) => {
        expect(['Invalid email', 'Format phone number is +(50X) XXXXXXXX, example: +(502) 45454545']).toContain(message.message);
      });
    });
  });

  describe('PUT', () => {
    it('Update a user with valid body', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        phone: '+(502) 45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: role.id
      };

      const response = await request(server.getApp()).put(`${baseUrl}/${user.id}`).send(body);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User updated successfully');
    });

    it('Can inactive a user with inactive role', async () => {
      const role = await new RoleBuilder().withInactiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        phone: '+(502) 45573001',
        status: 'INACTIVO',
        role: role.id
      };
      const response = await request(server.getApp()).put(`${baseUrl}/${user.id}`).send(body);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User updated successfully');
    });

    it('Update preferences notifications of a user', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();
      const body = {
        preferences: [
          {
            notificationType: 'ACCEPTANCE_ASSIGNMENT',
            enable: true
          },
          {
            notificationType: 'ACCEPTANCE_FORM',
            enable: false
          }
        ]
      };

      const response = await request(server.getApp()).put(`/api/v1/parameter/notifications/preferences/${user.id}`).send(body);
      const response2 = await request(server.getApp()).get(`/api/v1/parameter/notifications/preferences/${user.id}`).send(body);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'Notification preferences saved successfully');
      expect(response2.body.data.notificationPreferences.find((pref: any) => pref.enable === true)).toBeTruthy();
    });

    it('Reject request if trying update preferences notifications of a user that does not exist', async () => {
      const body = {
        preferences: [
          {
            notificationType: 'ACCEPTANCE_ASSIGNMENT',
            enable: true
          },
          {
            notificationType: 'ACCEPTANCE_FORM',
            enable: false
          }
        ]
      };

      const response = await request(server.getApp())
        .put(`/api/v1/parameter/notifications/preferences/${faker.string.uuid()}`)
        .send(body);

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('Reject request if trying update preferences notifications of an id that is not uuid', async () => {
      const body = {
        preferences: [
          {
            notificationType: 'ACCEPTANCE_ASSIGNMENT',
            enable: true
          },
          {
            notificationType: 'ACCEPTANCE_FORM',
            enable: false
          }
        ]
      };

      const response = await request(server.getApp()).put(`/api/v1/parameter/notifications/preferences/abc`).send(body);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });

    it('Reject request if trying update preferences notifications with notification type is not valid', async () => {
      const body = {
        preferences: [
          {
            notificationType: 'cualquier cosa',
            enable: true
          }
        ]
      };

      const response = await request(server.getApp())
        .put(`/api/v1/parameter/notifications/preferences/${faker.string.uuid()}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.message[0].message).toContain("Invalid enum value. Expected 'ACCEPTANCE_ASSIGNMENT' |");
    });

    it('Does not update a user that does not exist', async () => {
      const response = await request(server.getApp())
        .put(`${baseUrl}/${faker.string.uuid()}`)
        .send({
          name: faker.lorem.word({ length: 50 }),
          email: faker.internet.email(),
          phone: '+(502) 45573001',
          status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
          role: faker.string.uuid()
        });

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('Reject request to trying update a user without require parameters', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();

      const body = {
        phone: '+(502) 45573001'
      };

      const response = await request(server.getApp()).put(`${baseUrl}/${user.id}`).send(body);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      response.body.message.forEach((message: any) => {
        expect(['name', 'email', 'status', 'role']).toContain(message.path[0]);
        expect;
      });
    });

    it('Does not update a user with invalid role id', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        phone: '+(502) 45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: faker.string.uuid()
      };

      const response = await request(server.getApp()).put(`${baseUrl}/${user.id}`).send(body);

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'Role not found');
    });

    it('Does not update a user with inactive role id', async () => {
      const role = await new RoleBuilder().withInactiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: faker.internet.email(),
        phone: '+(502) 45573001',
        status: 'ACTIVO',
        role: role.id
      };

      const response = await request(server.getApp()).put(`${baseUrl}/${user.id}`).send(body);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'You can not update a user with an inactive role');
    });

    it('Reject request if phone number and email have wrong format', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();
      const body = {
        name: faker.lorem.word({ length: 50 }),
        email: 'mail',
        phone: '45573001',
        status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
        role: role.id
      };

      const response = await request(server.getApp()).put(`${baseUrl}/${user.id}`).send(body);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      response.body.message.forEach((message: any) => {
        expect(['Invalid email', 'Format phone number is +(50X) XXXXXXXX, example: +(502) 45454545']).toContain(message.message);
      });
    });
  });

  describe('DELETE', () => {
    it('Delete a user with valid id', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();

      const response = await request(server.getApp()).delete(`${baseUrl}/${user.id}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('Does not delete a user that does not exist', async () => {
      const response = await request(server.getApp()).delete(`${baseUrl}/${faker.string.uuid()}`);

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('Reject request if user id does not uuid', async () => {
      const response = await request(server.getApp()).delete(`${baseUrl}/abc`);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });

    it('Reject request if trying to get notitifcation preferences of a user that has been deleted', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();

      await request(server.getApp()).get(`/api/v1/parameter/notifications/preferences/${user.id}`).expect(200);
      await request(server.getApp()).delete(`/api/v1/parameter/users/${user.id}`).expect(200);
      const response = await request(server.getApp()).get(`/api/v1/parameter/notifications/preferences/${user.id}`);

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('GET', () => {
    it('Get all users', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      await new UserBuilder(role.id).withActiveStatus().build();
      await new UserBuilder(role.id).withActiveStatus().build();
      const response = await request(server.getApp()).get(`${baseUrl}?limit=20&page=1`);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pageCounter).toBe(1);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        status: expect.any(String),
        username: expect.any(String),
        role: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          status: expect.any(String)
        })
      });
    });

    it('When require page gather than page counter return empty array', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      await new UserBuilder(role.id).withActiveStatus().build();
      await new UserBuilder(role.id).withActiveStatus().build();
      await new UserBuilder(role.id).withActiveStatus().build();
      const response = await request(server.getApp()).get(`${baseUrl}?limit=20&page=2`);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
      expect(response.body.pageCounter).toBe(1);
    });

    it('If not exist user in database return empty array', async () => {
      const response = await request(server.getApp()).get(`${baseUrl}?limit=20&page=1`);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
      expect(response.body.pageCounter).toBe(0);
    });

    it('Does not get a user that it has been deleted', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();

      const response1 = await request(server.getApp()).get(`${baseUrl}?limit=20&page=1`);
      await request(server.getApp()).delete(`${baseUrl}/${user.id}`);
      const response2 = await request(server.getApp()).get(`${baseUrl}?limit=20&page=1`);

      expect(response1.status).toBe(200);
      expect(response1.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response1.body.data).toBeInstanceOf(Array);
      expect(response1.body.data.length).toBe(1);

      expect(response2.status).toBe(200);
      expect(response2.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response2.body.data).toBeInstanceOf(Array);
      expect(response2.body.data.length).toBe(0);
      expect(response2.body.pageCounter).toBe(0);
    });

    it('Get a user with valid id', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();

      const response = await request(server.getApp()).get(`${baseUrl}/${user.id}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.data).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        username: user.username,
        role: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          status: expect.any(String)
        })
      });
    });

    it('Does not get a user it it has been deleted', async () => {
      const role = await new RoleBuilder().withActiveStatus().build();
      const user = await new UserBuilder(role.id).withActiveStatus().build();

      await request(server.getApp()).delete(`${baseUrl}/${user.id}`);
      const response = await request(server.getApp()).get(`${baseUrl}/${user.id}`);

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('Does not get a user that does not exist', async () => {
      const response = await request(server.getApp()).get(`${baseUrl}/${faker.string.uuid()}`);

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('Reject request if user id does not uuid', async () => {
      const response = await request(server.getApp()).get(`${baseUrl}/abc`);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });

    it('Reject request if trying get notification preferences of a user that does not exist', async () => {
      const response = await request(server.getApp()).get(`/api/v1/parameter/notifications/preferences/${faker.string.uuid()}`);

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('Reject request if trying get notification preferences of an id that is not uuid', async () => {
      const response = await request(server.getApp()).get(`/api/v1/parameter/notifications/preferences/abc`);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });
  });
});
