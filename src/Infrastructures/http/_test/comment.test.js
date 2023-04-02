/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comment endpoint', () => {
  let accessToken;
  let userId;
  let threadId;

  beforeAll(async () => {
    const server = await createServer(container);
    const registerUserPayload = {
      username: 'yoyok',
      password: 'secret-my-password',
      fullname: 'Yoyok',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: registerUserPayload,
    });

    const responseJson = JSON.parse(response.payload);
    userId = responseJson.data.addedUser.id;

    // login user
    const credentials = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'yoyok',
        password: 'secret-my-password',
      },
    });

    const loginResponseJson = JSON.parse(credentials.payload);
    accessToken = loginResponseJson.data.accessToken;

    // input thread
    const requestPayload = { title: 'Thread Title', body: 'Thread body' };

    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    const responseThreadJson = JSON.parse(responseThread.payload);
    threadId = responseThreadJson.data.addedThread.id;
  });

  beforeEach(async () => {
    const server = await createServer(container);
    const credentials = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'yoyok',
        password: 'secret-my-password',
      },
    });

    const loginResponseJson = JSON.parse(credentials.payload);
    accessToken = loginResponseJson.data.accessToken;
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = { content: 'Comment di Thread' };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedComment.owner).toEqual(userId);
    });

    it('should no authentication', async () => {
      // Arrange
      const requestPayload = { content: 'Comment di Thread' };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 not found thread', async () => {
      // Arrange
      const requestPayload = { content: 'Comment di Thread' };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak tersedia');
    });

    it('should response 400 invalid payload', async () => {
      // Arrange
      const requestPayload = { comment: 'Comment di Thread' };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada');
    });

    it('should response 200 with status success', async () => {
      // Arrange
      const commentId = 'comment-test';
      await CommentsTableTestHelper.addComment({
        id: commentId, content: 'ini comment', owner: userId, threadId, is_delete: true,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
