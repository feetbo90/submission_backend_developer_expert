/* eslint-disable max-len */
/* eslint-disable no-undef */
const AddRepliesUseCase = require('../AddRepliesUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedReplies = require('../../../Domains/replies/entities/AddedReplies');
const AddReplies = require('../../../Domains/replies/entities/AddReplies');

describe('AddRepliesUseCase', () => {
  it('should orchestrating the add replies use case', async () => {
    // Arrange
    const useCasePayload = {
      content: 'test content',
    };
    const creadentialId = 'user-DWrT3pXe1hccYkV1eIAxS';
    const threadId = 'thread-h_W1Plfpj0TY7wyT2PUPX';
    const commentId = 'comment-h_W1Plfpj0TY7wyT2PUPX';
    const expectedAddedReplies = new AddedReplies({
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      content: 'test content',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    });
    /** creating dependency of use case */
    const mockRepliesRepository = new RepliesRepository();
    mockRepliesRepository.addReplies = jest.fn(() => Promise.resolve(expectedAddedReplies));

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailable = jest.fn(() => Promise.resolve());
    /** creating use case instance */
    const getRepliesUseCase = new AddRepliesUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const addReplies = await getRepliesUseCase.executeReplies(useCasePayload, creadentialId, commentId, threadId);

    // Assert
    expect(addReplies).toStrictEqual(new AddedReplies({
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      content: useCasePayload.content,
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    }));

    expect(mockRepliesRepository.addReplies).toBeCalledWith(new AddReplies({
      content: useCasePayload.content,
    }), creadentialId, commentId);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailable).toBeCalledWith(commentId);
  });
});
