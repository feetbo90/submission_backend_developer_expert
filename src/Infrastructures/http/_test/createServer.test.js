/* eslint-disable no-undef */
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'iqbal',
      fullname: 'Muhammad Iqbal Pradipta',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should response 201 and persisted user', async () => {
    // Arrange
    const requestPayload = {
      username: 'testuser',
      password: 'secret',
      fullname: 'Test User',
    };
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedUser).toBeDefined();
  });

  // it('should handle create thread server error correctly', async () => {
  //   // Arrange
  //   const requestPayload = {
  //     title: 'create threads dicoding',
  //     body: 'Dicoding Indonesia',
  //   };
  //   const server = await createServer({}); // fake injection

  //   // Action
  //   const response = await server.inject({
  //     method: 'POST',
  //     url: '/threads',
  //     payload: requestPayload,
  //   });

  //   // Assert
  //   const responseJson = JSON.parse(response.payload);
  //   expect(response.statusCode).toEqual(500);
  //   expect(responseJson.status).toEqual('error');
  //   expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  // });
});
