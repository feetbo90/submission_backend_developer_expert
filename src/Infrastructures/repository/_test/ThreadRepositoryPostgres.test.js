/* eslint-disable no-undef */
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreateThreads = require('../../../Domains/threads/entities/CreateThreads');
const CreatedThreads = require('../../../Domains/threads/entities/CreatedThreads');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  const userId = 'user-9000';
  const fakeIdGenerator = () => '9000';

  beforeAll(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-test')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw InvariantError when id available', async () => {
      // Arrange
      await ThreadTableTestHelper.addThread({
        id: 'thread-test', title: 'thread dicoding', body: 'thread dicoding body', owner: userId, createdAt: '2023-01-01', updatedAt: '2023-01',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-test')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addThread function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      // Arrange
      const createThreads = new CreateThreads({
        title: 'dicoding',
        body: 'Hallo Dicoding',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Actions
      await threadRepositoryPostgres.addThread(createThreads, userId);
      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-9000');
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual('thread-9000');
      expect(threads[0].title).toEqual('dicoding');
      expect(threads[0].body).toEqual('Hallo Dicoding');
    });

    it('should return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThreads({
        title: 'dicoding',
        body: 'Hallo Dicoding',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(createThread, userId);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThreads({
        id: 'thread-9000',
        title: 'dicoding',
        owner: userId,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread payload correctly', async () => {
      // Arrange
      const threadId = 'thread-test';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await ThreadTableTestHelper.addThread(
        {
          id: threadId,
          owner: userId,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      );
      const thread = await threadRepositoryPostgres.getThreadById(threadId);
      const threadTest = await ThreadTableTestHelper.getThreadById(threadId);
      // Assert
      expect(threadTest[0]).toStrictEqual(thread);
      expect(thread).toStrictEqual({
        body: 'holla from dicoding',
        created_at: '2023-01-01',
        id: 'thread-test',
        owner: userId,
        title: 'hallo dicoding',
        updated_at: '2023-01-01',
      });
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toBeDefined();
      expect(thread.title).toEqual('hallo dicoding');
      expect(thread.body).toBeDefined();
      expect(thread.body).toEqual('holla from dicoding');
      expect(thread.created_at).toBeDefined();
      expect(thread.updated_at).toBeDefined();
      expect(thread.owner).toEqual(userId);
    });
  });
});
