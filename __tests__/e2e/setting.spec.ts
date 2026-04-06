import request from 'supertest';
import { Server } from '../../src/server/server';
import { SettingBuilder } from '../utils/builders/setting-builder';
import { cleanDatabaseParameterTesting } from '../utils/db';
import { faker } from '@faker-js/faker';
import { ParametersHelper } from '../utils/helpers/parameters-helper';

const baseUrl = '/api/v1/parameter/settings';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await cleanDatabaseParameterTesting();
});

afterEach(async () => {
  await cleanDatabaseParameterTesting();
});

afterAll(async () => {
  await server.stopServer();
});

describe('E2E: Setting', () => {
  describe('GET', () => {
    it('Se devuelve todos los parámetros de configuración', async () => {

      await new SettingBuilder().withDataFaker().build();

      const response = await request(server.getApp())
        .get(`${baseUrl}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(String),
        settingKey: expect.any(String),
        settingValue: expect.any(String),
        description: expect.any(String)
      });
    });

    it('Devuelve la configuración de acuerdo al id solicitado', async () => {
      const setting = await new SettingBuilder().withDataFaker().build();

      const response = await request(server.getApp())
        .get(`${baseUrl}/${setting.id}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject({
        id: setting.id,
        settingKey: setting.settingKey,
        settingValue: setting.settingValue,
        description: setting.description
      });
    });

    it('Se rechaza la petición si el id no existe', async () => {
      const response = await request(server.getApp())
        .get(`${baseUrl}/${faker.string.uuid()}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Setting not found');
    });

    it('Se valida que el id tenga formato UUID', async () => {
      const response = await request(server.getApp())
        .get(`${baseUrl}/abc`)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });
  })

  describe('PATCH', () => {
    it('Se actualiza la configuración según el id solicitado', async () => {
      const setting = await new SettingBuilder().withDataFaker().build();
      const requestBody = { settingValue: faker.lorem.word(), description: faker.lorem.word() };

      const response = await request(server.getApp())
        .patch(`${baseUrl}/${setting.id}`)
        .send(requestBody)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Setting updated successfully');
      const updatedSetting = await ParametersHelper.getSettingByKey(setting.settingKey);
      expect(updatedSetting).toMatchObject({
        id: setting.id,
        settingKey: setting.settingKey,
        settingValue: requestBody.settingValue,
        description: requestBody.description
      });
    });

    it('Se rechaza la petición si el id no existe', async () => {
      const response = await request(server.getApp())
        .patch(`${baseUrl}/${faker.string.uuid()}`)
        .send({
          settingValue: faker.lorem.word(),
          description: faker.lorem.word()
        })
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'Setting not found');
    });

    it('Se valida que el id tenga formato UUID', async () => {
      const response = await request(server.getApp())
        .patch(`${baseUrl}/abc`)
        .send({
          settingValue: faker.lorem.word(),
          description: faker.lorem.word()
        })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message', 'Invalid uuid');
    });

    it('Se valida que el request tenga estructura y datos permitidos', async () => {

      const setting = await new SettingBuilder().withDataFaker().build();

      const response = await request(server.getApp())
        .patch(`${baseUrl}/${setting.id}`)
        .send({
          settingValue: "",
          description: ""
        })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.message[0]).toHaveProperty('message', 'String must contain at least 1 character(s)');
    });
  })
})
