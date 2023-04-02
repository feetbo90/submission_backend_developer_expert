/* eslint-disable max-len */
/* eslint-disable no-undef */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComments = require('../../../Domains/comments/entities/AddedComments');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-my-thread-for-comment-456';
  const userIdTwo = 'user-ok-123';
  const threadId = 'my-thread-456';
  const threadIdTwo = 'my-thread-890';
  const fakeIdGenerator = () => '456';

  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();

    await UsersTableTestHelper.addUser({ id: userId });
    await UsersTableTestHelper.addUser({
      id: userIdTwo, username: 'iqbal', password: 'password', fullname: 'iqbal',
    });
    await ThreadTableTestHelper.addThread({
      id: threadId, owner: userId, createdAt: '2023-01-01', updatedAt: '2023-01',
    });
    await ThreadTableTestHelper.addThread({
      id: threadIdTwo, owner: userIdTwo, createdAt: '2023-01-01', updatedAt: '2023-01',
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();

    await pool.end();
  });

  describe('addComment function', () => {
    it('should return created thread correctly', async () => {
    // Arrange
      const createComment = new AddComment({
        content: 'hallo ini comment thread',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(createComment, userId, threadId);
      const comment = await CommentsTableTestHelper.findCommentById('comment-456');

      // Assert
      expect(createdComment).toStrictEqual(new AddedComments({
        id: 'comment-456',
        content: 'hallo ini comment thread',
        owner: userId,
      }));
      expect(comment).toHaveLength(1);
      const { id, content } = comment[0];
      expect(id).toEqual('comment-456');
      expect(content).toEqual('hallo ini comment thread');
    });
    it('verify comment available', async () => {
    // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comment = await CommentsTableTestHelper.findCommentById('comment-456');

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailable('comment-456'))
        .resolves
        .not
        .toThrowError(NotFoundError);
      expect(comment).toHaveLength(1);
    });
    it('should throw NotFoundError when the comment is unavailable', async () => {
      // Arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailable(commentId))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('get comment by thread id available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await CommentsTableTestHelper.addComment(
        {
          id: 'comment-12345',
          content: 'hallo dicoding',
          owner: userIdTwo,
          threadId: threadIdTwo,
          is_delete: false,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      );
      const getCommentsByThreadId = await commentRepositoryPostgres.getCommentsByThreadId(threadIdTwo);

      // Assert
      expect(getCommentsByThreadId[0]).toStrictEqual({
        content: 'hallo dicoding',
        created_at: '2023-01-01',
        id: 'comment-12345',
        is_delete: false,
        owner: userIdTwo,
        thread: threadIdTwo,
        updated_at: '2023-01-01',
      });
      expect(getCommentsByThreadId).toHaveLength(1);
    });
    it('verify comment by owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentByOwner('comment-456', userId))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
    it('should throw AuthorizationError when owner is invalid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentByOwner('comment-456', ''))
        .rejects
        .toThrowError(AuthorizationError);
    });
    it('should return delete comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.deleteCommentAtThread('comment-456');
      const comment = await CommentsTableTestHelper.findCommentById('comment-456');

      // Assert
      const { id, is_delete: isDelete } = comment[0];
      expect(id).toEqual('comment-456');
      expect(isDelete).toBe(true);
    });
  });
});
