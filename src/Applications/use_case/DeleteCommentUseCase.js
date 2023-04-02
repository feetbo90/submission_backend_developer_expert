/* eslint-disable no-underscore-dangle */

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, credentialId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentAvailable(commentId);
    await this._commentRepository.verifyCommentByOwner(commentId, credentialId);
    await this._commentRepository.deleteCommentAtThread(commentId);
  }
}

module.exports = DeleteCommentUseCase;
