/* eslint-disable max-len */
/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockUserRepository = new UserRepository();

    /** dummies */
    const threadPayload = {
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      created_at: '2023-03-19',
      updated_at: '2023-03-19',
      owner: 'user-123',
    };

    const commentPayload = {
      id: 'comment-123',
      content: 'Comment Content',
      created_at: '2023-03-19',
      updated_at: '2023-03-19',
      is_delete: false,
      owner: 'user-123',
      thread: threadId,
    };

    const commentPayloadDeleted = {
      id: 'comment-234',
      content: 'Comment Content',
      created_at: '2023-03-19',
      updated_at: '2023-03-19',
      is_delete: true,
      owner: 'user-123',
      thread: threadId,
    };

    const replyPayload = {
      id: 'replies-123',
      content: 'Replies Content',
      created_at: '2023-03-19',
      updated_at: '2023-03-19',
      is_delete: false,
      owner: 'user-123',
      comment: commentPayload.id,
    };

    const replyPayloadDeleted = {
      id: 'replies-234',
      content: 'Replies Content',
      created_at: '2023-03-19',
      updated_at: '2023-03-19',
      is_delete: true,
      owner: 'user-123',
      comment: commentPayload.id,
    };

    const expectedThread = {
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-03-19',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-03-19',
          content: 'Comment Content',
          replies: [
            {
              id: 'replies-123',
              content: 'Replies Content',
              date: '2023-03-19',
              username: 'dicoding',
            },
            {
              id: 'replies-234',
              content: '**balasan telah dihapus**',
              date: '2023-03-19',
              username: 'dicoding',
            },
          ],
        },
        {
          id: 'comment-234',
          username: 'dicoding',
          date: '2023-03-19',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'replies-123',
              content: 'Replies Content',
              date: '2023-03-19',
              username: 'dicoding',
            },
            {
              id: 'replies-234',
              content: '**balasan telah dihapus**',
              date: '2023-03-19',
              username: 'dicoding',
            },
          ],
        },
      ],
    };

    mockUserRepository.getUsernameById = jest.fn(() => Promise.resolve('dicoding'));
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(threadPayload));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([commentPayload, commentPayloadDeleted]));
    mockRepliesRepository.getRepliesByCommentId = jest.fn(() => Promise.resolve([replyPayload, replyPayloadDeleted]));

    const detailThreadUseCase = new DetailThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const actualThreadDetail = await detailThreadUseCase.execute(threadId);

    // Assert
    expect(actualThreadDetail).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(threadPayload.owner);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockRepliesRepository.getRepliesByCommentId).toBeCalledWith(commentPayload.id);
  });
});
