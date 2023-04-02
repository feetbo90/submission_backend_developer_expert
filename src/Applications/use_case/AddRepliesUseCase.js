/* eslint-disable no-underscore-dangle */
const AddReplies = require('../../Domains/replies/entities/AddReplies');

class AddRepliesUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async executeReplies(useCasePayload, creadentialId, commentId, threadId) {
    const addReplies = new AddReplies(useCasePayload);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentAvailable(commentId);
    return this._repliesRepository.addReplies(addReplies, creadentialId, commentId);
  }
}

module.exports = AddRepliesUseCase;
