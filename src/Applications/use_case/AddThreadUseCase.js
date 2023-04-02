/* eslint-disable no-underscore-dangle */
const CreateThreads = require('../../Domains/threads/entities/CreateThreads');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const createThreads = new CreateThreads(useCasePayload);
    return this._threadRepository.addThread(createThreads, credentialId);
  }
}

module.exports = AddThreadUseCase;
