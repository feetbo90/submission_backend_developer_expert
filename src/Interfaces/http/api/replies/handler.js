/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const AddRepliesUseCase = require('../../../../Applications/use_case/AddRepliesUseCase');
const DeleteRepliesUseCase = require('../../../../Applications/use_case/DeleteRepliesUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postRepliesOnComment = this.postRepliesOnComment.bind(this);
    this.deleteRepliesOnComment = this.deleteRepliesOnComment.bind(this);
  }

  async postRepliesOnComment(request, h) {
    const addRepliesUseCase = this._container.getInstance(AddRepliesUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addedReply = await addRepliesUseCase.executeReplies(request.payload, credentialId, commentId, threadId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteRepliesOnComment(request, h) {
    const deleteRepliesOnComment = this._container.getInstance(DeleteRepliesUseCase.name);

    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await deleteRepliesOnComment.execute(threadId, commentId, credentialId, replyId);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
