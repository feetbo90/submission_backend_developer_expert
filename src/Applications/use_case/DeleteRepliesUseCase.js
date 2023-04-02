/* eslint-disable no-underscore-dangle */

class DeleteRepliesUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(threadId, commentId, credentialId, repliesId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentAvailable(commentId);
    await this._repliesRepository.verifyReplyAvailable(repliesId);
    await this._repliesRepository.verifyRepliesByOwner(repliesId, credentialId);
    await this._repliesRepository.deleteRepliesAtThread(repliesId);
  }
}

module.exports = DeleteRepliesUseCase;
