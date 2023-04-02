/* eslint-disable max-len */
/* eslint-disable no-undef */
const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComments');
const AddComment = require('../../../Domains/comments/entities/AddComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment use case', async () => {
    // Arrange
    const useCasePayload = {
      content: 'test content',
    };
    const creadentialId = 'user-DWrT3pXe1hccYkV1eIAxS';
    const threadId = 'thread-h_W1Plfpj0TY7wyT2PUPX';
    const expectedAddedComment = new AddedComment({
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      content: 'test content',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    });
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addComment = await getCommentUseCase.executeComment(useCasePayload, creadentialId, threadId);
    // await getCommentUseCase.execute(threadId);

    // Assert
    expect(addComment).toStrictEqual(new AddedComment({
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      content: useCasePayload.content,
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
    }), creadentialId, threadId);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
  });
});
