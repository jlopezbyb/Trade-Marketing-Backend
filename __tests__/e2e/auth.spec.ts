import request from 'supertest';
import { faker } from '@faker-js/faker';

import { Server } from '../../src/server/server';
import { cleanDatabaseAuthTesting } from '../utils/db';
import { UserMother } from '../utils/mother/user-mother';
import { RoleMother } from '../utils/mother/role-mother';
import { UserModel } from '../../src/contexts/shared/infrastructure/models/auth/user.model';
import { RoleModel } from '../../src/contexts/shared/infrastructure/models/auth/role.model';
import { ResourceModel } from '../../src/contexts/shared/infrastructure/models/auth/resource.model';
import { RoleDetailModel } from '../../src/contexts/shared/infrastructure/models/auth/role.detail.model';

const baseUrl = '/api/v1/auth';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await cleanDatabaseAuthTesting();
});

afterEach(async () => {
  await cleanDatabaseAuthTesting();
});

afterAll(async () => {
  await server.stopServer();
});

describe('E2E: Auth', () => {
  describe('POST', () => {
    it('Se hace login correctamente por credenciales válidas', async () => {
      const user = UserMother.createUserEntity({}).toPrimitives();
      const role = RoleMother.createRole({}).toPrimitives();
      const resources = [
        RoleMother.createResourceEntity().toPrimitives(),
        RoleMother.createResourceEntity().toPrimitives()
      ];
      await RoleModel.create({ ...role, status: 'ACTIVO' });
      await UserModel.create({ ...user, status: 'ACTIVO', role_id: role.id });
      await ResourceModel.bulkCreate(resources);
      //TODO: Change to camelCase
      await RoleDetailModel.bulkCreate([
        { role_id: role.id, resource_id: resources[0].id, can_access: true },
        { role_id: role.id, resource_id: resources[1].id, can_access: true }
      ]);

      const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: user.username, password: user.password })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.headers['set-cookie']).toBeDefined();
      const cookies = Array.from(response.headers['set-cookie']);
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
      const refreshTokenCookie = cookies.find(cookie =>
        cookie.startsWith('refresh_token=')
      );
      expect(tokenCookie).toBeDefined();
      expect(refreshTokenCookie).toBeDefined();
      expect(tokenCookie).toMatch(/^token=Bearer/);
      expect(refreshTokenCookie).toMatch(/^refresh_token=Bearer/);
      expect(tokenCookie).toContain('HttpOnly');
      expect(tokenCookie).toContain('Secure');
      expect(refreshTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('Secure');
      //TODO: check data
      //expect(tokenCookie).toContain('Max-Age=');
      //expect(refreshTokenCookie).toContain('Max-Age=');
    });

    it('No permite ingresar si un usuario existe pero no tiene un rol', async () => {
      const user = UserMother.createUserEntity({}).toPrimitives();
      const role = RoleMother.createRole({}).toPrimitives();
      const resources = [
        RoleMother.createResourceEntity().toPrimitives(),
        RoleMother.createResourceEntity().toPrimitives()
      ];
      await RoleModel.create({ ...role, status: 'ACTIVO' });
      await UserModel.create({ ...user, status: 'ACTIVO' });
      await ResourceModel.bulkCreate(resources);
      //TODO: Change to camelCase
      await RoleDetailModel.bulkCreate([
        { role_id: role.id, resource_id: resources[0].id, can_access: true },
        { role_id: role.id, resource_id: resources[1].id, can_access: true }
      ]);

      const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: user.username, password: user.password })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty(
        'message',
        'User have no role assigned'
      );
    });

    it('No permite ingresar si un usuario existe pero está inactivo', async () => {
      const user = UserMother.createUserEntity({}).toPrimitives();
      const role = RoleMother.createRole({}).toPrimitives();
      const resources = [
        RoleMother.createResourceEntity().toPrimitives(),
        RoleMother.createResourceEntity().toPrimitives()
      ];
      await RoleModel.create({ ...role, status: 'ACTIVO' });
      await UserModel.create({ ...user, status: 'INACTIVO' });
      await ResourceModel.bulkCreate(resources);
      //TODO: Change to camelCase
      await RoleDetailModel.bulkCreate([
        { role_id: role.id, resource_id: resources[0].id, can_access: true },
        { role_id: role.id, resource_id: resources[1].id, can_access: true }
      ]);

      const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: user.username, password: user.password })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('No se permite ingresar si un usuario tiene un rol inactivo', async () => {
      const user = UserMother.createUserEntity({}).toPrimitives();
      const role = RoleMother.createRole({}).toPrimitives();
      const resources = [
        RoleMother.createResourceEntity().toPrimitives(),
        RoleMother.createResourceEntity().toPrimitives()
      ];
      await RoleModel.create({ ...role, status: 'INACTIVO' });
      await UserModel.create({ ...user, status: 'ACTIVO', role_id: role.id });
      await ResourceModel.bulkCreate(resources);
      //TODO: Change to camelCase
      await RoleDetailModel.bulkCreate([
        { role_id: role.id, resource_id: resources[0].id, can_access: true },
        { role_id: role.id, resource_id: resources[1].id, can_access: true }
      ]);

      const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: user.username, password: user.password })
        .expect(401);

      expect(response.body).toHaveProperty(
        'message',
        'Role assigned to user is inactive'
      );
    });

    it('No se permite hacer login con credenciales inválidas', async () => {
      const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: faker.lorem.word(), password: faker.lorem.word() })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('No se permite hacer login con credenciales vacías', async () => {
      const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: '', password: '' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message');
      expect(response.body.message[0]).toHaveProperty('code');
    });

    it('Permite hacer un refresh de token', async () => {
      const user = UserMother.createUserEntity({}).toPrimitives();
      const role = RoleMother.createRole({}).toPrimitives();
      const resources = [
        RoleMother.createResourceEntity().toPrimitives(),
        RoleMother.createResourceEntity().toPrimitives()
      ];
      await RoleModel.create({ ...role, status: 'ACTIVO' });
      await UserModel.create({ ...user, status: 'ACTIVO', role_id: role.id });
      await ResourceModel.bulkCreate(resources);
      //TODO: Change to camelCase
      await RoleDetailModel.bulkCreate([
        { role_id: role.id, resource_id: resources[0].id, can_access: true },
        { role_id: role.id, resource_id: resources[1].id, can_access: true }
      ]);

      const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: user.username, password: user.password })
        .expect(200)
        .expect('Content-Type', /json/);

      const cookies = response.headers['set-cookie'];

      const timeOut = setTimeout(async () => {
        const response2 = await request(server.getApp())
          .post(`${baseUrl}/refresh-token`)
          .set('Cookie', cookies)
          .expect(200)
          .expect('Content-Type', /json/);

        expect(response2.headers['set-cookie']).toBeDefined();
        const cookies2 = Array.from(response2.headers['set-cookie']);
        const tokenCookie2 = cookies2.find(cookie =>
          cookie.startsWith('token=')
        );
        const refreshTokenCookie2 = cookies2.find(cookie =>
          cookie.startsWith('refresh_token=')
        );
        expect(tokenCookie2).toBeDefined();
        expect(refreshTokenCookie2).toBeDefined();
        expect(tokenCookie2).toMatch(/^token=Bearer/);
        expect(refreshTokenCookie2).toMatch(/^refresh_token=Bearer/);
        expect(response.headers['set-cookie']).not.toEqual(
          response2.headers['set-cookie']
        );
      }, 1000);

      clearTimeout(timeOut);
    });

    it('No permite hacer un refresh de token con un token inválido', async () => {
      const response = await request(server.getApp())
        .post(`${baseUrl}/refresh-token`)
        .set(
          'Cookie',
          'refresh_token=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        )
        .expect(403)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('No permite continuar si no se ha proporcionado un token', async () => {
      const response = await request(server.getApp())
        .post(`${baseUrl}/refresh-token`)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Token not provided');
    });

    it.skip('No se permite hacer un refresh posterior a la expiración del token-refresh', async () => {
      const user = UserMother.createUserEntity({}).toPrimitives();
      const role = RoleMother.createRole({}).toPrimitives();
      const resources = [
        RoleMother.createResourceEntity().toPrimitives(),
        RoleMother.createResourceEntity().toPrimitives()
      ];

      await RoleModel.create({ ...role, status: 'ACTIVO' });
      await UserModel.create({
        ...user,
        status: 'ACTIVO',
        role_id: role.id,
        username: 'Cora72'
      });
      await ResourceModel.bulkCreate(resources);

      await RoleDetailModel.bulkCreate([
        { role_id: role.id, resource_id: resources[0].id, can_access: true },
        { role_id: role.id, resource_id: resources[1].id, can_access: true }
      ]);

      const response = await request(server.getApp())
        .post(`${baseUrl}/refresh-token`)
        .set(
          'Cookie',
          'refresh_token=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQ29yYTcyIiwicm9sZSI6IkRyLiBBbm5lIFJpdGNoaWUtVmFuZGVydm9ydCIsInJlc291cmNlcyI6WyJhZGltcGxlbyIsImF1dHVzIl0sImlhdCI6MTcyNjE1ODQwNCwiZXhwIjoxNzI2MTYzODA0LCJhdWQiOiJ3d3cuYWRtaW4tcGFya2luZy5jbGFyby5jb20uZ3QifQ.FTmYBLQ3KR5IZvQbuGh7PPA9RvNR0BTDwF2ZKYXzxJg'
        )
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('Cuando se hace un logout se elimina información de cualquier token', async () => {
      const user = UserMother.createUserEntity({}).toPrimitives();
      const role = RoleMother.createRole({}).toPrimitives();
      const resources = [
        RoleMother.createResourceEntity().toPrimitives(),
        RoleMother.createResourceEntity().toPrimitives()
      ];

      await RoleModel.create({ ...role, status: 'ACTIVO' });
      await UserModel.create({
        ...user,
        status: 'ACTIVO',
        role_id: role.id,
      });
      await ResourceModel.bulkCreate(resources);

      await RoleDetailModel.bulkCreate([
        { role_id: role.id, resource_id: resources[0].id, can_access: true },
        { role_id: role.id, resource_id: resources[1].id, can_access: true }
      ]);

       const response = await request(server.getApp())
        .post(`${baseUrl}/login`)
        .send({ username: user.username, password: user.password })
        .expect(200)
        .expect('Content-Type', /json/);

      const cookies = response.headers['set-cookie'];

      const response2 = await request(server.getApp())
        .post(`${baseUrl}/logout`)
        .set('Cookie', cookies)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response2.body).toEqual({ message: 'Bye!' });
      expect(response2.headers['set-cookie'][0]).toMatch(/^token=;/);
      expect(response2.headers['set-cookie'][1]).toMatch(/^refresh_token=;/);
    });
  });
});
