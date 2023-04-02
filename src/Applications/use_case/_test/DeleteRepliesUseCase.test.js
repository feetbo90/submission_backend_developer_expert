/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');

const DeleteRepliesUseCase = require('../DeleteRepliesUseCase');

describe('DeleteRepliesUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';
    const repliesId = 'replies-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailable = jest.fn(() => Promise.resolve());
    mockRepliesRepository.verifyReplyAvailable = jest.fn(() => Promise.resolve());
    mockRepliesRepository.verifyRepliesByOwner = jest.fn(() => Promise.resolve());
    mockRepliesRepository.deleteRepliesAtThread = jest.fn(() => Promise.resolve());

    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    await deleteRepliesUseCase.execute(threadId, commentId, ownerId, repliesId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailable).toHaveBeenCalledWith(commentId);
    expect(mockRepliesRepository.verifyReplyAvailable).toHaveBeenCalledWith(repliesId);
    expect(mockRepliesRepository.verifyRepliesByOwner).toHaveBeenCalledWith(repliesId, ownerId);
    expect(mockRepliesRepository.deleteRepliesAtThread).toHaveBeenCalledWith(repliesId);
  });
});
