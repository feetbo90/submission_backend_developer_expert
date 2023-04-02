/* eslint-disable no-underscore-dangle */
const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async executeComment(useCasePayload, creadentialId, threadId) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(threadId);
    return this._commentRepository.addComment(addComment, creadentialId, threadId);
  }
}

module.exports = AddCommentUseCase;
