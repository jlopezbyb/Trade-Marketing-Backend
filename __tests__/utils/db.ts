import { sequelize } from '../../src/server/config/database/sequelize';

export const prepareDatabase = async () => {
    try {
    await sequelize.query(`
      INSERT INTO parking_testing.location (id, name, address, contact_reference, phone, email, comments, number_of_identifier, status, created_at, updated_at, deleted_at)
      VALUES ('fa15f4b4-0330-4020-94bc-3a118e68deb9','Central Parking','123 Main St, Cityville','John Doe','555-1234','johndoe@example.com','Open 24/7','CP-001','ACTIVO',now(),now(),NULL);

      `);

    await sequelize.query(`
        INSERT INTO parking_testing.slot (id, location_id, slot_number, slot_type, limit_of_assignments, vehicle_type, cost_type, cost, status, created_at, updated_at, deleted_at)
        VALUES
        ('fa15f4b4-0330-4020-94bc-3a118e68deb7','fa15f4b4-0330-4020-94bc-3a118e68deb9','A-101','MULTIPLE',2,'CARRO','SIN_COSTO',0,'DISPONIBLE',now(),now(),NULL),
        ('fa15f4b4-0330-4020-94bc-3a118e68deb8','fa15f4b4-0330-4020-94bc-3a118e68deb9','A-102','SIMPLE',1,'CARRO','SIN_COSTO',0,'DISPONIBLE',now(),now(),NULL);
        `);

    await sequelize.query(`
      insert into tag (id, name, description, status, created_at, updated_at)
      values ('76425a22-a237-42a9-92fc-9368ed807893', 'primary', 'Dolorem quia officia a.', 'ACTIVO', now(), now());
      `);
  } catch (error) {
    console.log('Error create data');
    console.log(error);
  }
}


export const cleanDatabaseAssignmentTesting = async () => {
  try {
    await sequelize.query('DELETE FROM assignment_loan');
    await sequelize.query('DELETE FROM de_assignment');
    await sequelize.query('DELETE FROM assignment_tag_detail');
    await sequelize.query('DELETE FROM assignment');
    await sequelize.query('DELETE FROM vehicle');
    await sequelize.query('DELETE FROM employee');
  } catch (error) {
    console.log('Error cleaning database:', error);
  }
};

export const cleanDatabaseLocationTesting = async () => {
  try {
    await sequelize.query('DELETE FROM location');
    await sequelize.query('DELETE FROM slot');
  } catch (error) {
    console.log('Error cleaning database:', error);
  }
};

export const cleanDatabaseTagTesting = async () => {
  try {
    await sequelize.query('DELETE FROM tag');
  } catch (error) {
    console.log('Error cleaning database:', error);
  }
};

export const cleanDatabaseAuthTesting = async () => {
  try {
    await sequelize.query('DELETE FROM role_detail');
    await sequelize.query('DELETE FROM user');
    await sequelize.query('DELETE FROM role');
    await sequelize.query('DELETE FROM resource');
  } catch (error) {
    console.log('Error cleaning database:', error);
  }
};

export const cleanDatabaseParameterTesting = async () => {
  try {
    await sequelize.query('DELETE FROM setting');
  } catch (error) {
    console.log('Error cleaning database:', error);
  }
};


export const clearDatabaseAuth = async () => {
  try {
    await sequelize.query('DELETE FROM notification_preference');
    await sequelize.query('DELETE FROM role_detail');
    await sequelize.query('DELETE FROM user');
    await sequelize.query('DELETE FROM role');
    await sequelize.query('DELETE FROM resource');
  } catch (error) {
    console.log('Error cleaning database:', error);
  }
};
