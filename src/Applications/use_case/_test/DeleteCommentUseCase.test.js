/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentByOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentAtThread = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(threadId, commentId, ownerId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailable).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentByOwner).toHaveBeenCalledWith(commentId, ownerId);
    expect(mockCommentRepository.deleteCommentAtThread).toHaveBeenCalledWith(commentId);
  });
});
