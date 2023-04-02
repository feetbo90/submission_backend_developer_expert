/* eslint-disable max-len */
/* eslint-disable no-undef */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const pool = require('../../database/postgres/pool');
const AddReplies = require('../../../Domains/replies/entities/AddReplies');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const AddedReplies = require('../../../Domains/replies/entities/AddedReplies');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('RepliesRepositoryPostgres', () => {
  const userId = 'user-threadcommentreplies-789';
  const threadId = 'my-thread-789';

  const commentId = 'my-comment-789';
  const fakeIdGenerator = () => '789';

  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();

    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadTableTestHelper.addThread({
      id: threadId, owner: userId, createdAt: '2023-01-01', updatedAt: '2023-01',
    });
    await CommentsTableTestHelper.addComment({
      id: commentId, content: 'ini replies', owner: userId, threadId,
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();

    await pool.end();
  });

  describe('addReplies function', () => {
    it('should return created replies correctly', async () => {
    // Arrange
      const createReplies = new AddReplies({
        content: 'hallo ini replies thread',
      });
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReplies = await repliesRepositoryPostgres.addReplies(createReplies, userId, commentId);
      const replies = await RepliesTableTestHelper.findRepliesById('replies-789');
      // Assert
      expect(createdReplies).toStrictEqual(new AddedReplies({
        id: 'replies-789',
        content: 'hallo ini replies thread',
        owner: userId,
      }));
      expect(replies).toHaveLength(1);
    });
    it('verify replies available', async () => {
    // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action &

      // Assert
      await expect(repliesRepositoryPostgres.verifyReplyAvailable('replies-789')).resolves.not.toThrowError(NotFoundError);
    });
    it('should throw error NotFoundError replies not available', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action &

      // Assert
      await expect(repliesRepositoryPostgres.verifyReplyAvailable('replies-780')).rejects.toThrowError(NotFoundError);
    });
    it('get replies by comment id available', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const getRepliesByCommentId = await repliesRepositoryPostgres.getRepliesByCommentId(commentId);

      // Assert
      expect(getRepliesByCommentId).toHaveLength(1);
      expect(getRepliesByCommentId).toBeDefined();
      expect(getRepliesByCommentId[0].id).toEqual('replies-789');
      expect(getRepliesByCommentId[0].content).toEqual('hallo ini replies thread');
      expect(getRepliesByCommentId[0].comment).toEqual(commentId);
      expect(getRepliesByCommentId[0].owner).toEqual(userId);
      expect(getRepliesByCommentId[0].created_at).not.toBeNull();
      expect(getRepliesByCommentId[0].updated_at).not.toBeNull();
      expect(getRepliesByCommentId[0].is_delete).not.toBeNull();
    });
    it('verify replies by owner', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      // &
      // Assert
      await expect(repliesRepositoryPostgres.verifyRepliesByOwner('replies-789', userId)).resolves.not.toThrowError(AuthorizationError);
    });
    it('should error AuthorizationError replies by owner', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      // &
      // Assert
      await expect(repliesRepositoryPostgres.verifyRepliesByOwner('replies-789', '')).rejects.toThrowError(AuthorizationError);
    });
    it('should return delete replies correctly', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const rowCount = await repliesRepositoryPostgres.deleteRepliesAtThread('replies-789');
      const replies = await RepliesTableTestHelper.findRepliesById('replies-789');

      // Assert
      expect(replies[0].id).toEqual('replies-789');
      expect(replies[0].is_delete).toBe(true);
    });
  });
});
